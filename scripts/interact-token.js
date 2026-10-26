const hre = require("hardhat");

async function main() {
  console.log("====================================================");
  console.log("     PayrollCredit (PAYC) Token Demonstration");
  console.log("====================================================");
  console.log("Network:", hre.network.name);

  const signers = await hre.ethers.getSigners();
  const deployer = signers[0];
  const recipient = signers.length > 1 ? signers[1] : null;
  const recipientAddress = recipient ? recipient.address : "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

  console.log("Deployer account: ", deployer.address);
  console.log("Recipient account:", recipientAddress);

  let payrollCredit;
  const targetAddress = process.env.PAYROLL_CREDIT_ADDRESS;

  if (targetAddress && hre.ethers.isAddress(targetAddress)) {
    console.log(`Connecting to existing PayrollCredit at: ${targetAddress}`);
    payrollCredit = await hre.ethers.getContractAt("PayrollCredit", targetAddress);
  } else {
    console.log("Deploying fresh PayrollCredit instance for demonstration...");
    const Factory = await hre.ethers.getContractFactory("PayrollCredit");
    payrollCredit = await Factory.deploy();
    await payrollCredit.waitForDeployment();
  }

  const contractAddress = await payrollCredit.getAddress();
  console.log("\n--- Token Metadata ---");
  console.log("Contract Address:  ", contractAddress);
  console.log("Token Name:        ", await payrollCredit.name());
  console.log("Token Symbol:      ", await payrollCredit.symbol());
  console.log("Token Decimals:    ", (await payrollCredit.decimals()).toString());

  const totalSupply = await payrollCredit.totalSupply();
  console.log("Total Supply:      ", hre.ethers.formatEther(totalSupply), "PAYC");

  const initialDeployerBal = await payrollCredit.balanceOf(deployer.address);
  const initialRecipientBal = await payrollCredit.balanceOf(recipientAddress);
  console.log("Deployer Balance:  ", hre.ethers.formatEther(initialDeployerBal), "PAYC");
  console.log("Recipient Balance: ", hre.ethers.formatEther(initialRecipientBal), "PAYC");

  // Transfer 100 PAYC
  const transferAmount = hre.ethers.parseEther("100");
  console.log("\n[Transfer Action] Transferring 100 PAYC to recipient...");
  const tx = await payrollCredit.connect(deployer).transfer(recipientAddress, transferAmount);
  console.log("Transaction submitted. Hash:", tx.hash);
  const receipt = await tx.wait();
  console.log("Transaction confirmed in block:", receipt.blockNumber);

  // Balances after transfer
  const postDeployerBal = await payrollCredit.balanceOf(deployer.address);
  const postRecipientBal = await payrollCredit.balanceOf(recipientAddress);
  console.log("\n--- Balances After Transfer ---");
  console.log("Deployer Balance:  ", hre.ethers.formatEther(postDeployerBal), "PAYC");
  console.log("Recipient Balance: ", hre.ethers.formatEther(postRecipientBal), "PAYC");

  // Total supply check
  const supplyAfter = await payrollCredit.totalSupply();
  console.log("Total Supply:      ", hre.ethers.formatEther(supplyAfter), "PAYC");
  if (supplyAfter === totalSupply) {
    console.log("✔ Total supply verified unchanged.");
  }

  console.log("====================================================");
}

main().catch((error) => {
  console.error("Token interaction failed:", error);
  process.exitCode = 1;
});
