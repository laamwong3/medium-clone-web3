import { ethers } from "hardhat";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function main() {
  const fees = ethers.utils.parseEther("0.01");
  const Medium = await ethers.getContractFactory("Medium");
  const medium = await Medium.deploy("Medium Blog", "BLOG", fees);

  // console.log(medium.interface.format("json"));
  // await medium.deployed();
  const mediumData = {
    address: medium.address,
    abi: JSON.parse(medium.interface.format("json").toString()),
  };

  fs.writeFileSync(
    "../constants/contractABI/Medium.json",
    JSON.stringify(mediumData, null, 2)
  );
  console.log("Medium deployed to:", medium.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
