const hre = require("hardhat");

async function main() {
  console.log("=== Deploying PayrollCredit (PAYC) ===");
  console.log("Network:", hre.network.name);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer ETH balance:", hre.ethers.formatEther(balance));

  const PayrollCreditFactory = await hre.ethers.getContractFactory("PayrollCredit");
  const payrollCredit = await PayrollCreditFactory.deploy();
  await payrollCredit.waitForDeployment();

  const contractAddress = await payrollCredit.getAddress();
  console.log("PayrollCredit deployed successfully to:", contractAddress);
  console.log("Token Name:", await payrollCredit.name());
  console.log("Token Symbol:", await payrollCredit.symbol());
  console.log("Decimals:", (await payrollCredit.decimals()).toString());
  console.log(
    "Total Supply:",
    hre.ethers.formatEther(await payrollCredit.totalSupply()),
    "PAYC"
  );
  console.log(
    "Deployer Token Balance:",
    hre.ethers.formatEther(await payrollCredit.balanceOf(deployer.address)),
    "PAYC"
  );

  console.log("\nSource verification command:");
  console.log(`npx hardhat verify --network ${hre.network.name} ${contractAddress}`);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
