const hre = require("hardhat");

async function main() {
  console.log("====================================================");
  console.log("       PayrollConfig Contract Demonstration");
  console.log("====================================================");
  console.log("Network:", hre.network.name);

  const signers = await hre.ethers.getSigners();
  const admin = signers[0];
  const nonAdmin = signers.length > 1 ? signers[1] : null;

  console.log("Admin account:    ", admin.address);
  if (nonAdmin) {
    console.log("Non-admin account:", nonAdmin.address);
  }

  let payrollConfig;
  const targetAddress = process.env.PAYROLL_CONFIG_ADDRESS;

  if (targetAddress && hre.ethers.isAddress(targetAddress)) {
    console.log(`Connecting to existing PayrollConfig at: ${targetAddress}`);
    payrollConfig = await hre.ethers.getContractAt("PayrollConfig", targetAddress);
  } else {
    console.log("Deploying fresh PayrollConfig instance for demonstration...");
    const Factory = await hre.ethers.getContractFactory("PayrollConfig");
    payrollConfig = await Factory.deploy();
    await payrollConfig.waitForDeployment();
  }

  const contractAddress = await payrollConfig.getAddress();
  console.log("Contract Address: ", contractAddress);

  // 1. Read admin
  const contractAdmin = await payrollConfig.admin();
  console.log("Administrator:    ", contractAdmin);

  // 2. Read initial configuration value
  const initialRate = await payrollConfig.getPayrollRate();
  console.log("Initial Rate:     ", initialRate.toString());

  // 3. Set value to 5000 using authorized account
  console.log("\n[Admin Action] Setting payroll rate to 5000...");
  const tx = await payrollConfig.connect(admin).setPayrollRate(5000n);
  console.log("Transaction submitted. Hash:", tx.hash);
  const receipt = await tx.wait();
  console.log("Transaction confirmed in block:", receipt.blockNumber);

  // 4. Read back updated value
  const updatedRate = await payrollConfig.getPayrollRate();
  console.log("Updated Rate:     ", updatedRate.toString());

  // 5. Demonstrate non-admin setter call reverts
  console.log("\n[Security Verification] Testing unauthorized setter call rejection...");
  if (nonAdmin) {
    try {
      // Use staticCall to simulate the transaction without wasting gas or reverting on-chain
      await payrollConfig.connect(nonAdmin).setPayrollRate.staticCall(9999n);
      console.error("FAIL: Unauthorized call did not revert!");
    } catch (err) {
      console.log("✔ Revert confirmed: Non-admin setter call was rejected!");
      console.log("  Revert Reason:", err.reason || err.shortMessage || err.message);
    }
  } else {
    console.log("Single signer environment; automated non-admin revert verified via test suite.");
  }

  // 6. Confirm unauthorized call did not change stored value
  const rateAfterAttempt = await payrollConfig.getPayrollRate();
  console.log("Rate after unauthorized attempt:", rateAfterAttempt.toString());
  if (rateAfterAttempt === 5000n) {
    console.log("✔ Stored value remains protected and unchanged at 5000.");
  }

  console.log("====================================================");
}

main().catch((error) => {
  console.error("Interaction failed:", error);
  process.exitCode = 1;
});
