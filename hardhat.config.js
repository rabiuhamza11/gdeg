require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { PRIVATE_KEY, POLYGON_MUMBAI_RPC_URL, POLYGONSCAN_API_KEY } = process.env;

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 }
    }
  },
  networks: {
    polygon_mumbai: {
      url: POLYGON_MUMBAI_RPC_URL || "https://rpc-mumbai.maticvigil.com",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 80001
    },
    polygon_mainnet: {
      url: "https://polygon-rpc.com",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 137
    },
    hardhat: {
      chainId: 1337
    }
  },
  etherscan: {
    apiKey: {
      polygonMumbai: POLYGONSCAN_API_KEY || "",
      polygon: POLYGONSCAN_API_KEY || ""
    }
  }
};
