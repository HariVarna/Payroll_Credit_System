const { expect } = require("chai");
const hre = require("hardhat");

describe("PayrollCredit (PAYC) Token Contract", function () {
  let payrollCredit;
  let deployer, recipient, otherAccount;
  const EXPECTED_INITIAL_SUPPLY = hre.ethers.parseEther("1000000"); // 1,000,000 * 10^18

  beforeEach(async function () {
    [deployer, recipient, otherAccount] = await hre.ethers.getSigners();
    const PayrollCreditFactory = await hre.ethers.getContractFactory("PayrollCredit");
    payrollCredit = await PayrollCreditFactory.deploy();
    await payrollCredit.waitForDeployment();
  });

  describe("Token Metadata & Initial Supply", function () {
    it("should verify token name, symbol, and decimals", async function () {
      expect(await payrollCredit.name()).to.equal("Payroll Credit");
      expect(await payrollCredit.symbol()).to.equal("PAYC");
      expect(await payrollCredit.decimals()).to.equal(18);
    });

    it("should initialize total supply to exactly 1,000,000 PAYC", async function () {
      expect(await payrollCredit.totalSupply()).to.equal(EXPECTED_INITIAL_SUPPLY);
    });

    it("should mint the entire initial supply to the deployer balance", async function () {
      expect(await payrollCredit.balanceOf(deployer.address)).to.equal(EXPECTED_INITIAL_SUPPLY);
    });

    it("should report zero initial balance for other accounts", async function () {
      expect(await payrollCredit.balanceOf(recipient.address)).to.equal(0n);
      expect(await payrollCredit.balanceOf(otherAccount.address)).to.equal(0n);
    });
  });

  describe("Standard ERC-20 Transfers", function () {
    it("should execute a successful token transfer and emit Transfer event", async function () {
      const transferAmount = hre.ethers.parseEther("25000");
      await expect(
        payrollCredit.connect(deployer).transfer(recipient.address, transferAmount)
      )
        .to.emit(payrollCredit, "Transfer")
        .withArgs(deployer.address, recipient.address, transferAmount);
    });

    it("should accurately update sender and recipient balances following a transfer", async function () {
      const transferAmount = hre.ethers.parseEther("50000");
      await payrollCredit.connect(deployer).transfer(recipient.address, transferAmount);

      const expectedDeployerBalance = EXPECTED_INITIAL_SUPPLY - transferAmount;
      expect(await payrollCredit.balanceOf(deployer.address)).to.equal(expectedDeployerBalance);
      expect(await payrollCredit.balanceOf(recipient.address)).to.equal(transferAmount);
    });

    it("should maintain unchanged total supply across multiple transfers", async function () {
      const transfer1 = hre.ethers.parseEther("10000");
      const transfer2 = hre.ethers.parseEther("4000");

      await payrollCredit.connect(deployer).transfer(recipient.address, transfer1);
      await payrollCredit.connect(recipient).transfer(otherAccount.address, transfer2);

      expect(await payrollCredit.totalSupply()).to.equal(EXPECTED_INITIAL_SUPPLY);
    });

    it("should fail when transfer amount exceeds the sender's available balance", async function () {
      const excessAmount = hre.ethers.parseEther("100");
      // recipient has 0 balance initially
      await expect(
        payrollCredit.connect(recipient).transfer(otherAccount.address, excessAmount)
      ).to.be.revertedWithCustomError(payrollCredit, "ERC20InsufficientBalance");
    });
  });
});
