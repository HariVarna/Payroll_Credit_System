require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Extract environment variables safely
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const RAW_PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

// Normalize private key and guard against placeholder values
const isPlaceholderKey =
  !RAW_PRIVATE_KEY ||
  RAW_PRIVATE_KEY.includes("0000000000000000000000000000000000000000000000000000000000000000") ||
  RAW_PRIVATE_KEY.length < 64;

const accounts = !isPlaceholderKey
  ? [RAW_PRIVATE_KEY.startsWith("0x") ? RAW_PRIVATE_KEY : `0x${RAW_PRIVATE_KEY}`]
  : [];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: accounts,
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
    },
  },
  sourcify: {
    enabled: false,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000,
  },
};
