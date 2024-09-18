
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";
import csv from "csv-parser";

interface CsvRow {
  address: string;
  amount: string;
}

const values: [string, string][] = [];

fs.createReadStream("airdrop.csv")
  .pipe(csv())
  .on("data", (row: CsvRow) => {
    values.push([row.address, row.amount]);
  })
  .on("end", () => {
    const tree = StandardMerkleTree.of(values, ["address", "uint256"]);
    console.log("Merkle Root:", tree.root);

    // Write the tree to a JSON file
    fs.writeFileSync("tree.json", JSON.stringify(tree.dump()));

    // Initialize an object to store proofs for all addresses
    const proofs: Record<string, string[]> = {};

    try {
      const loadedTree = StandardMerkleTree.load(JSON.parse(fs.readFileSync("tree.json", "utf8")));
      for (const [i, v] of loadedTree.entries()) {
        // Get the proof for each address
        const proof = loadedTree.getProof(i);
        proofs[v[0]] = proof; // Store the proof with the address as the key
      }

      // Write all proofs to a JSON file
      fs.writeFileSync("proofs.json", JSON.stringify(proofs, null, 2));
      console.log("All proofs have been saved to 'proofs.json'.");
      
    } catch (err) {
      console.error("Error reading or processing 'tree.json':", err);
    }
  })
  .on("error", (err: Error) => {
    console.error("Error reading 'airdrop.csv':", err);
  });
