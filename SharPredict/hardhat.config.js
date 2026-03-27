import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

export default {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    shardeum: {
      url: "https://api-testnet.shardeum.org/",
      chainId: 8083,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
    },
  },
};
