const hre = require("hardhat");

async function main() {
  console.log("=== Deploying PayrollConfig ===");
  console.log("Network:", hre.network.name);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer ETH balance:", hre.ethers.formatEther(balance));

  const PayrollConfigFactory = await hre.ethers.getContractFactory("PayrollConfig");
  const payrollConfig = await PayrollConfigFactory.deploy();
  await payrollConfig.waitForDeployment();

  const contractAddress = await payrollConfig.getAddress();
  console.log("PayrollConfig deployed successfully to:", contractAddress);
  console.log("Administrator address:", await payrollConfig.admin());
  console.log("Initial rate:", (await payrollConfig.getPayrollRate()).toString());

  console.log("\nSource verification command:");
  console.log(`npx hardhat verify --network ${hre.network.name} ${contractAddress}`);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
