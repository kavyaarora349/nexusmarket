import fs from "fs";
import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
    if (!fs.existsSync("deployments.json")) {
        throw new Error("No deployments.json found. Deploy first.");
    }
    const deployments = JSON.parse(fs.readFileSync("deployments.json", "utf-8"));

    const [deployer] = await ethers.getSigners();

    const factory = await ethers.getContractAt("MarketFactory", deployments.MarketFactory);

    console.log("Seeding demo markets...");

    const endTime1 = Math.floor(Date.now() / 1000) + 86400 * 7;
    const tx1 = await factory.createMarket(
        "Will ETH reach $4000 by End of Month?",
        "Resolves to YES if Ethereum price hits $4000.",
        "Crypto",
        endTime1,
        1, // ADMIN
        { value: ethers.parseEther("0.1") }
    );
    await tx1.wait();

    const endTime2 = Math.floor(Date.now() / 1000) + 86400 * 14;
    const tx2 = await factory.createMarket(
        "Who will win the Super Bowl?",
        "Community resolved market for Super Bowl.",
        "Sports",
        endTime2,
        0, // COMMUNITY
        { value: ethers.parseEther("0.1") }
    );
    await tx2.wait();

    const endTime3 = Math.floor(Date.now() / 1000) + 86400 * 2;
    const tx3 = await factory.createMarket(
        "Will OpenAI release GPT-5 this year?",
        "Admin resolution for AI.",
        "Tech",
        endTime3,
        1, // ADMIN
        { value: ethers.parseEther("0.1") }
    );
    await tx3.wait();

    console.log("Successfully seeded 3 demo markets.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
