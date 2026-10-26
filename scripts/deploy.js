const hre = require("hardhat");

async function main() {
  console.log("====================================================");
  console.log("       Payroll Credit System - Deployment");
  console.log("====================================================");
  console.log("Network:", hre.network.name);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // 1. Deploy PayrollConfig
  console.log("\n[1/2] Deploying PayrollConfig...");
  const PayrollConfigFactory = await hre.ethers.getContractFactory("PayrollConfig");
  const payrollConfig = await PayrollConfigFactory.deploy();
  await payrollConfig.waitForDeployment();
  const configAddress = await payrollConfig.getAddress();
  console.log("✔ PayrollConfig deployed at:", configAddress);
  console.log("  Administrator:", await payrollConfig.admin());
  console.log("  Initial Payroll Rate:", (await payrollConfig.getPayrollRate()).toString());

  // 2. Deploy PayrollCredit (PAYC)
  console.log("\n[2/2] Deploying PayrollCredit (PAYC)...");
  const PayrollCreditFactory = await hre.ethers.getContractFactory("PayrollCredit");
  const payrollCredit = await PayrollCreditFactory.deploy();
  await payrollCredit.waitForDeployment();
  const creditAddress = await payrollCredit.getAddress();
  console.log("✔ PayrollCredit deployed at:", creditAddress);
  console.log("  Token Name:", await payrollCredit.name());
  console.log("  Token Symbol:", await payrollCredit.symbol());
  console.log(
    "  Initial Supply:",
    hre.ethers.formatEther(await payrollCredit.totalSupply()),
    "PAYC"
  );
  console.log(
    "  Deployer Balance:",
    hre.ethers.formatEther(await payrollCredit.balanceOf(deployer.address)),
    "PAYC"
  );

  console.log("\n====================================================");
  console.log("              Deployment Summary");
  console.log("====================================================");
  console.log("Network:       ", hre.network.name);
  console.log("Deployer:      ", deployer.address);
  console.log("PayrollConfig: ", configAddress);
  console.log("PayrollCredit: ", creditAddress);
  console.log("====================================================");

  if (hre.network.name === "sepolia") {
    console.log("\nTo verify contracts on Etherscan, run:");
    console.log(`npx hardhat verify --network sepolia ${configAddress}`);
    console.log(`npx hardhat verify --network sepolia ${creditAddress}`);
  }
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
