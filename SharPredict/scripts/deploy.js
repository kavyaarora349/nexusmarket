import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
    console.log("Deploying Prediction Market Factory...");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deployer:", deployer.address);

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Balance:", hre.ethers.formatEther(balance), "SHM");

    const MarketFactory = await hre.ethers.getContractFactory("MarketFactory");
    const factory = await MarketFactory.deploy();

    await factory.waitForDeployment();
    const factoryAddress = await factory.getAddress();

    console.log("MarketFactory deployed to:", factoryAddress);

    // Read the ABI from artifacts
    const factoryArtifact = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../artifacts/contracts/MarketFactory.sol/MarketFactory.json"), "utf-8")
    );
    const pmArtifact = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../artifacts/contracts/PredictionMarket.sol/PredictionMarket.json"), "utf-8")
    );

    const deployments = {
        MarketFactory: {
            address: factoryAddress,
            abi: factoryArtifact.abi
        },
        PredictionMarket: {
            abi: pmArtifact.abi
        },
        network: hre.network.name,
        deployer: deployer.address,
        deploymentTime: new Date().toISOString()
    };

    fs.writeFileSync(
        path.join(__dirname, "../deployments.json"),
        JSON.stringify(deployments, null, 4)
    );
    console.log("Saved to deployments.json");

    // Also save to frontend utils for easy consumption
    const frontendContractFile = path.join(__dirname, "../../src/utils/contract.ts");
    const contractContent = `export const CONTRACT_ADDRESS = '${factoryAddress}';

export const MARKET_FACTORY_ABI = ${JSON.stringify(factoryArtifact.abi, null, 2)};

export const PREDICTION_MARKET_ABI = ${JSON.stringify(pmArtifact.abi, null, 2)};

export const CONTRACT_ABI = MARKET_FACTORY_ABI; // Default to factory
`;

    fs.writeFileSync(frontendContractFile, contractContent);
    console.log("Updated src/utils/contract.ts with deployed address and ABIs");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
