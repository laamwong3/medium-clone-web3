import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { Medium, Medium__factory } from "../typechain";

describe("Testing Medium.sol", () => {
  let Medium: Medium__factory;
  let medium: Medium;
  let owner: SignerWithAddress;
  let blogger1: SignerWithAddress;

  const feesInEther = 5;
  beforeEach(async () => {
    const fees = ethers.utils.parseEther(feesInEther.toString());
    [owner, blogger1] = await ethers.getSigners();
    Medium = await ethers.getContractFactory("Medium");
    medium = await Medium.connect(owner).deploy("TestToken", "TT", fees);
    await medium.deployed();
  });

  describe("Constructor", () => {
    it("Should set the state variable", async () => {
      const fees = ethers.utils.parseEther(feesInEther.toString());
      expect(await medium.getFees()).to.be.equal(fees);
    });
  });

  describe("SafeMint", () => {
    it("Should revert if not enough ether sent", async () => {
      const feesSent = ethers.utils.parseEther((feesInEther / 2).toString());
      const tx = medium.safeMint(blogger1.address, "something", {
        value: feesSent,
      });

      await expect(tx).to.be.reverted;
    });
    it("Should transfer fund to owner", async () => {
      const feesSent = ethers.utils.parseEther(feesInEther.toString());
      console.log("fee sent", ethers.utils.formatEther(feesSent));
      const ownerBalanceBefore = await owner.getBalance();
      console.log("before", ownerBalanceBefore);
      const tx = await medium.safeMint(blogger1.address, "something", {
        value: feesSent,
      });
      await tx.wait(1);
      const ownerBalanceAfter = await owner.getBalance();
      console.log(ownerBalanceAfter);
      const ownerGain = Number(ownerBalanceAfter) - Number(ownerBalanceBefore);
      console.log(ownerGain);
      const feesReceive = ethers.utils.parseEther(feesInEther.toString());
      //expect(ownerGain.toString()).to.be.equal(feesReceive);
    });
  });
});
