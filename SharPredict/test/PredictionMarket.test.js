import { expect } from "chai";
import hardhat from "hardhat";
const { ethers } = hardhat;
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("PredictionMarket", function () {
    let PredictionMarket, MarketFactory;
    let factory, market;
    let owner, creator, user1, user2, addrs;
    let endTime;

    beforeEach(async function () {
        [owner, creator, user1, user2, ...addrs] = await ethers.getSigners();

        MarketFactory = await ethers.getContractFactory("MarketFactory");
        factory = await MarketFactory.deploy();

        endTime = (await time.latest()) + 86400;

        const tx = await factory.connect(creator).createMarket(
            "Will SHM hit $1?",
            "Prediction for SHM price",
            "Crypto",
            endTime,
            1, // ADMIN
            { value: ethers.parseEther("0.1") }
        );

        const receipt = await tx.wait();
        const event = receipt.logs.find(e => {
            try {
                return factory.interface.parseLog(e).name === 'MarketCreated';
            } catch (err) { return false; }
        });
        const parsedLog = factory.interface.parseLog(event);
        const marketAddress = parsedLog.args.marketAddress;

        PredictionMarket = await ethers.getContractFactory("PredictionMarket");
        market = PredictionMarket.attach(marketAddress);
    });

    it("Should place bet successfully", async function () {
        await market.connect(user1).placeBet(1, { value: ethers.parseEther("1.0") });
        const pos = await market.getUserPosition(user1.address);
        expect(pos.amount).to.equal(ethers.parseEther("1.0"));
        expect(pos.side).to.equal(1);
    });

    it("Should calculate odds correctly", async function () {
        await market.connect(user1).placeBet(1, { value: ethers.parseEther("1.0") });
        await market.connect(user2).placeBet(2, { value: ethers.parseEther("3.0") });

        const [yes, no] = await market.getMarketOdds();
        expect(yes).to.equal(25n);
        expect(no).to.equal(74n);
    });

    it("Should resolve market and payout correctly", async function () {
        await market.connect(user1).placeBet(1, { value: ethers.parseEther("1.0") });
        await market.connect(user2).placeBet(2, { value: ethers.parseEther("3.0") });

        await time.increaseTo(endTime + 1);

        await market.connect(owner).resolveMarket(2, "https://evidence.com");

        const status = await market.getMarket();
        expect(status.status).to.equal(2n);

        const initialBal = await ethers.provider.getBalance(user2.address);
        const tx = await market.connect(user2).claimReward();
        const receipt = await tx.wait();
        const gasUsed = receipt.gasUsed * receipt.gasPrice;

        const finalBal = await ethers.provider.getBalance(user2.address);

        const totalWon = finalBal - initialBal + gasUsed;
        expect(totalWon).to.be.above(ethers.parseEther("3.9"));
    });

    it("Should handle platform fee properly", async function () {
        await market.connect(user1).placeBet(1, { value: ethers.parseEther("1.0") });
        await market.connect(user2).placeBet(2, { value: ethers.parseEther("1.0") });

        await time.increaseTo(endTime + 1);

        const ownerInitial = await ethers.provider.getBalance(owner.address);

        await market.connect(owner).resolveMarket(1, "https://evidence.com");
        await market.connect(user1).claimReward();

        const ownerFinal = await ethers.provider.getBalance(owner.address);
        expect(ownerFinal).to.be.above(ownerInitial);
    });

    it("Should allow community voting and staked payout", async function () {
        const tx = await factory.connect(creator).createMarket(
            "Community Market",
            "Test dest",
            "Misc",
            endTime,
            0, // COMMUNITY
            { value: ethers.parseEther("0.1") }
        );
        const receipt = await tx.wait();
        const ev = receipt.logs.find(e => {
            try { return factory.interface.parseLog(e).name === 'MarketCreated'; } catch (err) { return false; }
        });
        const parsed = factory.interface.parseLog(ev);
        const comMarket = PredictionMarket.attach(parsed.args.marketAddress);

        await comMarket.connect(user1).placeBet(1, { value: ethers.parseEther("1.0") });
        await time.increaseTo(endTime + 1);

        await comMarket.connect(user2).submitCommunityVote(1, { value: ethers.parseEther("0.5") });

        const m = await comMarket.getMarket();
        expect(m.status).to.equal(1n); // PENDING
    });
});
