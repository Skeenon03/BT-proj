# 🗳️ E-Voting dApp (Expo + Solidity + Hardhat)

Blockchain voting app: candidates and votes live in a smart contract on a **local Hardhat blockchain** (free, no real money, no MetaMask). One address = one vote; results are transparent and tamper-resistant.

## What you need to install (one time)
1. **Node.js 18+** (https://nodejs.org) — only if `node -v` fails.
2. **Expo Go** app on your phone (App Store / Play Store). Or use an emulator/simulator.

No accounts, no websites to sign up for, no paid services.

## Run it (2 commands)
```bash
npm run setup   # installs everything (root + app)
npm run dev     # starts blockchain, deploys contract, starts Expo
```
Scan the QR code with Expo Go. **Phone and computer must be on the same Wi-Fi.**
Press `w` in the terminal to open it in the browser instead.

Other commands: `npm test` (runs 5 contract tests).

## How to use the app
- Top chips choose who you are: **Admin** (account #0) or **Voter 1–9** (Hardhat's free test accounts).
- Tap **Vote** on a candidate — a real transaction is sent to the contract. A second vote from the same voter is rejected by the blockchain.
- As **Admin**: add candidates or **End Election**; the winner gets a 🏆.

## How it works (for viva)
- `contracts/Voting.sol` — admin, candidates, `vote()` (once per address), `endElection()`, events.
- `scripts/deploy.js` — deploys and writes the address + ABI to `app/src/contract.json`.
- `app/src/chain.js` — uses **ethers.js** JSON-RPC to talk to the node. Hardhat's test accounts are unlocked on the node, so the app needs no private keys.
- Connectivity: the app reuses the Expo server's IP (your PC's LAN IP) with port 8545, and Hardhat runs with `--hostname 0.0.0.0`.
- Why tamper-resistant: votes are stored on-chain; nobody (even admin) can edit counts or vote twice.

## Troubleshooting
- "Cannot reach blockchain": keep `npm run dev` running; phone must be on same Wi-Fi; allow Node through your firewall (ports 8545, 8081).
- Restarting the chain resets all votes (local chain is in-memory); `npm run dev` redeploys automatically.
- Manual mode: terminal 1 `npm run chain`, terminal 2 `npm run deploy`, terminal 3 `npm run app`.

> Demo project only: anyone can vote once per account (no voter identity verification).

## Build an APK (optional)
Needs a free Expo account (https://expo.dev/signup). Run `npm run dev` once first so `app/src/contract.json` exists.
```bash
cd app
npx eas-cli login
npx eas-cli build -p android --profile apk
```
Download the `.apk` from the link it prints and install it on the phone. In the installed app, type your computer's IP (shown by `ipconfig getifaddr en0` on Mac) in **Blockchain server** and tap **Connect**. `npm run dev` must be running on the computer (phone on the same Wi-Fi/hotspot). The contract address is the same on every fresh chain, so one APK keeps working.

## Use from anywhere (friend in another place)
Keep `npm run dev` running, then in a second terminal:
```bash
npm run share
```
Copy the `https://….trycloudflare.com` link it prints and enter it in the app's **Blockchain server** box. Free, no account. The link changes each time you run it, and works only while your computer is on.
