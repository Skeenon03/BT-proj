// One command to run everything: starts the local blockchain, deploys the contract, starts Expo.
const { spawn, execSync } = require("child_process");
const http = require("http");

const run = (cmd, args, opts = {}) =>
  spawn(cmd, args, { stdio: "inherit", shell: process.platform === "win32", ...opts });

const chain = run("npx", ["hardhat", "node", "--hostname", "0.0.0.0"], { stdio: "ignore" });
const quit = () => { chain.kill(); process.exit(); };
process.on("SIGINT", quit); process.on("SIGTERM", quit);

function ready(cb, tries = 60) {
  const req = http.request({ host: "127.0.0.1", port: 8545, method: "POST", headers: { "Content-Type": "application/json" } },
    () => cb());
  req.on("error", () => (tries > 0 ? setTimeout(() => ready(cb, tries - 1), 500) : (console.error("Blockchain did not start"), quit())));
  req.end('{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}');
}

console.log("⛓  Starting local blockchain...");
ready(() => {
  execSync("npx hardhat run scripts/deploy.js --network localhost", { stdio: "inherit" });
  console.log("📱 Starting Expo... scan the QR code with Expo Go (same Wi-Fi as this computer)");
  const expo = run("npx", ["expo", "start", "--lan"], { cwd: "app" });
  expo.on("exit", quit);
});
