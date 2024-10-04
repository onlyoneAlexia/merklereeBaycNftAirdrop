import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const BaycAirdropModule = buildModule("BaycAirdropodule", (m) => {


  const baycAirdrop = m.contract("BaycAirdrop",  ["address", "bytes32"],
    );

  return { baycAirdrop };
});

export default BaycAirdropModule;

