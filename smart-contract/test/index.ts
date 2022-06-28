import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { Medium, Medium__factory } from "../typechain";

describe("Testing Medium.sol", () => {
  let Medium: Medium__factory;
  let medium: Medium;
  let owner: SignerWithAddress;
  let blogger1: SignerWithAddress;

  const feesInEther = 1;
  beforeEach(async () => {
    const fees = ethers.utils.parseEther(feesInEther.toString());
    [owner, blogger1] = await ethers.getSigners();
    Medium = await ethers.getContractFactory("Medium");
    medium = await Medium.connect(owner).deploy("TestToken", "TT", fees);
    await medium.deployed();
    // console.log("owner is ", owner.address);
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
      const feesSent = ethers.utils.parseEther((feesInEther * 2).toString());

      await expect(() =>
        medium
          .connect(blogger1)
          .safeMint(blogger1.address, "something", { value: feesSent })
      ).to.changeEtherBalance(owner, parseEther(feesInEther.toString()));

      // const feesSent = ethers.utils.parseEther("1");
      // console.log("fee sent", ethers.utils.formatEther(feesSent));
      // const ownerBalanceBefore = await owner.getBalance();
      // // console.log("Owner is ", await medium.owner());
      // console.log("before", ethers.utils.formatEther(ownerBalanceBefore));
      // const tx = await medium
      //   .connect(blogger1)
      //   .safeMint(blogger1.address, "something", {
      //     value: feesSent,
      //   });
      // const recepit = await tx.wait(1);
      // const gasUsed = recepit.gasUsed.mul(recepit.effectiveGasPrice);

      // const ownerBalanceAfter = await owner.getBalance();
      // console.log(ethers.utils.formatEther(ownerBalanceAfter));
      // console.log(
      //   "blogger1 balance ",
      //   ethers.utils.formatEther(await blogger1.getBalance())
      // );

      // expect(await owner.getBalance()).to.be.equal(
      //   parseEther("100001").sub(gasUsed)
      // );

      // const ownerGain = Number(ownerBalanceAfter) - Number(ownerBalanceBefore);

      // const feesReceive = ethers.utils.parseEther(feesInEther.toString());
      //expect(ownerGain.toString()).to.be.equal(feesReceive);
    });
    it("Should refund the caller if they overpay", async () => {
      const feesSent = ethers.utils.parseEther((feesInEther * 10).toString());

      await expect(() =>
        medium
          .connect(blogger1)
          .safeMint(blogger1.address, "something", { value: feesSent })
      ).to.changeEtherBalance(
        blogger1,
        parseEther((feesInEther * -1).toString())
      );
    });
  });
});
