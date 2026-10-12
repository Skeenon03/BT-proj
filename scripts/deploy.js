const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  const names = ["Alice Sharma", "Rahul Verma", "Priya Patil"];
  const voting = await hre.ethers.deployContract("Voting", [names]);
  await voting.waitForDeployment();
  const address = await voting.getAddress();

  const artifact = await hre.artifacts.readArtifact("Voting");
  const out = path.join(__dirname, "..", "app", "src", "contract.json");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ address, abi: artifact.abi }, null, 2));
  console.log("Voting deployed to:", address);
  console.log("Address + ABI written to app/src/contract.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
