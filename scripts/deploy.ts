import { ethers,run } from "hardhat";
import { main } from "./merkletree";

async function deploy() {

    const t1=await ethers.getContractFactory('Alexia')
    const t2=await t1.deploy();
    await t2.waitForDeployment()
    const web3CXITokenAddress = await ethers.getContractFactory('BaycAirdrop')
    const root='0xde4728ff44e24d1e26cfe2f81b8882d583a2d23a2962674ba9117380ed9d64dc'
    const web3CXI = await web3CXITokenAddress.deploy(t2.target,root);
 await  web3CXI.waitForDeployment()

   console.log('Token deployed to',t2.target)
   console.log('Drop Contract deployed to',web3CXI.target)

   await run("verify:verify", {
    address: web3CXI.target,
    constructorArguments: [
      t2.target,
      "0xde4728ff44e24d1e26cfe2f81b8882d583a2d23a2962674ba9117380ed9d64dc",
    
    ],
  });
   



    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deploy().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

