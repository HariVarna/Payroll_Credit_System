const fs = require("fs");
const path = require("path");
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("=== Sepolia Pre-Deployment Validation ===");

  // 1. Check .env file existence
  const envPath = path.join(__dirname, "..", ".env");
  const envExists = fs.existsSync(envPath);
  console.log(".env file exists:", envExists ? "YES" : "NO (missing)");

  // 2. Check Git ignore status
  // 3. Check variable presence without exposing values
  const rpcSet = Boolean(process.env.SEPOLIA_RPC_URL && !process.env.SEPOLIA_RPC_URL.includes("YOUR_API_KEY"));
  const keySet = Boolean(
    process.env.PRIVATE_KEY &&
    !process.env.PRIVATE_KEY.includes("0000000000000000000000000000000000000000000000000000000000000000") &&
    process.env.PRIVATE_KEY.length >= 64
  );
  const etherscanSet = Boolean(
    process.env.ETHERSCAN_API_KEY &&
    !process.env.ETHERSCAN_API_KEY.includes("YOUR_ETHERSCAN_API_KEY")
  );

  console.log("SEPOLIA_RPC_URL configured:", rpcSet ? "YES (Valid endpoint provided)" : "NO (Placeholder or Missing)");
  console.log("PRIVATE_KEY configured:     ", keySet ? "YES (Valid length key provided)" : "NO (Placeholder or Missing)");
  console.log("ETHERSCAN_API_KEY configured:", etherscanSet ? "YES (Valid key provided)" : "NO (Placeholder or Missing)");

  if (!envExists || !rpcSet || !keySet) {
    console.log("\n[STATUS: CONFIGURATION INCOMPLETE]");
    console.log("To deploy to Sepolia testnet, please provide the actual values in .env:");
    if (!envExists) {
      console.log(" - Copy .env.example to .env: 'cp .env.example .env'");
    }
    if (!rpcSet) {
      console.log(" - Set a valid SEPOLIA_RPC_URL (e.g. from Infura, Alchemy, or public RPC)");
    }
    if (!keySet) {
      console.log(" - Set a valid PRIVATE_KEY holding Sepolia testnet ETH");
    }
    if (!etherscanSet) {
      console.log(" - Set a valid ETHERSCAN_API_KEY for automatic Etherscan contract verification");
    }
    return false;
  }

  // If configured, check balance on Sepolia
  try {
    const provider = new hre.ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log("\nConnecting to Sepolia via RPC...");
    const network = await provider.getNetwork();
    console.log("Connected Network:", network.name, "| Chain ID:", Number(network.chainId));

    const balance = await provider.getBalance(wallet.address);
    console.log("Deployer Address:", wallet.address);
    console.log("Sepolia ETH Balance:", hre.ethers.formatEther(balance), "ETH");

    if (balance === 0n) {
      console.log("\n[WARNING] Deployer balance is 0 ETH. Request testnet ETH from a Sepolia faucet before deploying.");
      return false;
    }

    console.log("\n[STATUS: READY FOR SEPOLIA DEPLOYMENT]");
    return true;
  } catch (error) {
    console.error("\nConnection to Sepolia failed:", error.message);
    return false;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
