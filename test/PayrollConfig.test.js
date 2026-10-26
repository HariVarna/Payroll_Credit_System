const { expect } = require("chai");
const hre = require("hardhat");

describe("PayrollConfig Contract", function () {
  let payrollConfig;
  let admin, user1;

  beforeEach(async function () {
    [admin, user1] = await hre.ethers.getSigners();
    const PayrollConfigFactory = await hre.ethers.getContractFactory("PayrollConfig");
    payrollConfig = await PayrollConfigFactory.deploy();
    await payrollConfig.waitForDeployment();
  });

  describe("Deployment & Initialization", function () {
    it("should record the deployer as administrator during deployment", async function () {
      expect(await payrollConfig.admin()).to.equal(admin.address);
    });

    it("should initialize the payroll configuration rate to zero", async function () {
      expect(await payrollConfig.getPayrollRate()).to.equal(0n);
    });
  });

  describe("Payroll Rate Management", function () {
    it("should allow the administrator to update the rate via setPayrollRate", async function () {
      const newRate = 5000n;
      await payrollConfig.connect(admin).setPayrollRate(newRate);
      expect(await payrollConfig.getPayrollRate()).to.equal(newRate);
    });

    it("should return the updated value through public getPayrollRate() getter", async function () {
      const newRate = 8500n;
      await payrollConfig.connect(admin).setPayrollRate(newRate);
      const fetchedRate = await payrollConfig.getPayrollRate();
      expect(fetchedRate).to.equal(newRate);
    });

    it("should emit a ConfigurationUpdated event when the value changes", async function () {
      const newRate = 7200n;
      await expect(payrollConfig.connect(admin).setPayrollRate(newRate))
        .to.emit(payrollConfig, "ConfigurationUpdated")
        .withArgs(newRate, admin.address);
    });

    it("should reject non-admin setter calls with proper revert reason", async function () {
      const unauthorizedRate = 9999n;
      await expect(
        payrollConfig.connect(user1).setPayrollRate(unauthorizedRate)
      ).to.be.revertedWith("PayrollConfig: caller is not the administrator");
    });

    it("should leave the stored value unchanged after a failed unauthorized call", async function () {
      const initialRate = 3000n;
      await payrollConfig.connect(admin).setPayrollRate(initialRate);
      expect(await payrollConfig.getPayrollRate()).to.equal(initialRate);

      // Attempt unauthorized modification
      await expect(
        payrollConfig.connect(user1).setPayrollRate(9999n)
      ).to.be.revertedWith("PayrollConfig: caller is not the administrator");

      // Verify stored value is untouched
      expect(await payrollConfig.getPayrollRate()).to.equal(initialRate);
    });
  });
});
