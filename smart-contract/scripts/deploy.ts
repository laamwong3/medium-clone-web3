import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const fees = ethers.utils.parseEther("0.01");
  const Medium = await ethers.getContractFactory("Medium");
  const medium = await Medium.deploy("Medium Blog", "BLOG", fees);

  // await medium.deployed();

  console.log("Medium deployed to:", medium.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
