import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const RPC_URL = "https://sphinx.shardeum.org/";
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

const artifact = JSON.parse(
    fs.readFileSync("./artifacts/contracts/MarketFactory.sol/MarketFactory.json", "utf8")
);

async function main() {
    console.log("Connecting to Shardeum Testnet...");
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log("Deployer:", wallet.address);

    const balance = await provider.getBalance(wallet.address);
    console.log("Balance:", ethers.formatEther(balance), "SHM");

    console.log("Deploying MarketFactory...");
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
    const contract = await factory.deploy();

    console.log("Transaction hash:", contract.deploymentTransaction().hash);
    console.log("Waiting for confirmation...");

    await contract.waitForDeployment();
    const address = await contract.getAddress();

    console.log("MarketFactory deployed to:", address);

    fs.writeFileSync("deployments.json", JSON.stringify({
        MarketFactory: address,
        network: "shardeum_testnet",
        deployer: wallet.address,
        timestamp: new Date().toISOString()
    }, null, 4));
    console.log("Saved to deployments.json");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
