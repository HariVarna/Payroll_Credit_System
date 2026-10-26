const { expect } = require("chai");
const hre = require("hardhat");

describe("Hardhat Environment Setup", function () {
  it("should initialize Hardhat runtime environment and provide test signers", async function () {
    const signers = await hre.ethers.getSigners();
    expect(signers.length).to.be.greaterThan(0);
    expect(hre.network.name).to.equal("hardhat");
  });

  it("should retrieve network chain ID", async function () {
    const network = await hre.ethers.provider.getNetwork();
    expect(Number(network.chainId)).to.equal(31337);
  });
});
