import { ethers } from "ethers";
import fs from "fs";
import Market from "./models/Market.js";
import Bet from "./models/Bet.js";
import OddsSnapshot from "./models/OddsSnapshot.js";

const factoryAbi = JSON.parse(fs.readFileSync("./artifacts/contracts/MarketFactory.sol/MarketFactory.json", "utf-8")).abi;
const marketAbi = JSON.parse(fs.readFileSync("./artifacts/contracts/PredictionMarket.sol/PredictionMarket.json", "utf-8")).abi;

export async function startListener() {
    if (!fs.existsSync("deployments.json")) {
        console.log("No deployments.json found. Waiting for deploy...");
        return;
    }

    const deployments = JSON.parse(fs.readFileSync("deployments.json", "utf-8"));
    const provider = new ethers.JsonRpcProvider("https://sphinx.shardeum.org/");
    const factory = new ethers.Contract(deployments.MarketFactory, factoryAbi, provider);

    console.log("Listener started on MarketFactory:", deployments.MarketFactory);

    factory.on("MarketCreated", async (id, creator, title, endTime, marketAddress, event) => {
        try {
            console.log(`MarketCreated: ${id} at ${marketAddress}`);
            await Market.findOneAndUpdate(
                { marketId: Number(id) },
                {
                    marketId: Number(id),
                    creator,
                    title,
                    endTime: Number(endTime),
                    status: 0,
                },
                { upsert: true }
            );
            listenToMarket(marketAddress, Number(id), provider);
        } catch (err) {
            console.error("Error saving MarketCreated:", err);
        }
    });

    try {
        const allMarkets = await factory.getAllMarkets();
        for (let m of allMarkets) {
            listenToMarket(m.marketAddress, Number(m.id), provider);
        }
    } catch (err) {
        console.error("Failed to fetch initial markets:", err);
    }
}

function listenToMarket(marketAddress, marketId, provider) {
    const marketContract = new ethers.Contract(marketAddress, marketAbi, provider);

    marketContract.on("BetPlaced", async (id, user, side, amount, event) => {
        try {
            console.log(`BetPlaced: Market ${id}, User ${user}, Side ${side}, Amount ${amount}`);

            const bet = new Bet({
                marketId: Number(id),
                user,
                side: Number(side),
                amount: amount.toString(),
                txHash: event.log.transactionHash
            });
            await bet.save();

            const odds = await marketContract.getMarketOdds();
            const snapshot = new OddsSnapshot({
                marketId: Number(id),
                yesPercent: Number(odds[0]),
                noPercent: Number(odds[1])
            });
            await snapshot.save();

            const marketData = await marketContract.getMarket();
            await Market.findOneAndUpdate({ marketId: Number(id) }, {
                totalYesAmount: marketData.totalYesAmount.toString(),
                totalNoAmount: marketData.totalNoAmount.toString(),
            });

        } catch (err) {
            if (err.code !== 11000) {
                console.error("Error saving BetPlaced:", err);
            }
        }
    });

    marketContract.on("MarketResolved", async (id, outcome, evidenceURI) => {
        console.log(`MarketResolved: ${id} outcome ${outcome}`);
        await Market.findOneAndUpdate({ marketId: Number(id) }, {
            status: 2,
            outcome: Number(outcome),
            evidenceURI
        });
    });

    marketContract.on("RewardClaimed", async (id, user, amount, event) => {
        console.log(`RewardClaimed: Market ${id}, User ${user}, Amount ${amount}`);
        await Bet.updateMany(
            { marketId: Number(id), user },
            { claimed: true }
        );
    });
}
