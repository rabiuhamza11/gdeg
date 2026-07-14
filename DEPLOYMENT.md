# GDEG Testnet Deployment Guide

## Network: Polygon Amoy (Chain ID: 80002)
Note: Mumbai testnet was deprecated March 2024. Amoy is the official replacement.

## Step 1 — Get Test MATIC
Visit: https://faucet.polygon.technology
Connect your wallet and request Amoy MATIC (free)

## Step 2 — Set Environment Variables
Create a .env file:
```
GDEG_PRIVATE_KEY=your_wallet_private_key_here
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
POLYGONSCAN_API_KEY=your_polygonscan_key
```

## Step 3 — Install Dependencies
```bash
npm install
```

## Step 4 — Compile Contracts
```bash
npx hardhat compile
```

## Step 5 — Deploy to Amoy Testnet
```bash
npx hardhat run scripts/deploy.js --network polygon_amoy
```

## Step 6 — Verify Contracts (optional)
```bash
npx hardhat verify --network polygon_amoy DEPLOYED_ADDRESS
```

## Useful Links
- Amoy Explorer: https://amoy.polygonscan.com
- Amoy Faucet: https://faucet.polygon.technology
- Amoy RPC: https://rpc-amoy.polygon.technology
- GDEG Repo: https://github.com/rabiuhamza11/gdeg

## Contracts to Deploy
1. NodeRegistry.sol — deploy first
2. EnergyToken.sol — deploy after NodeRegistry
3. TradingEngine.sol — deploy last (needs EBT + USDC addresses)

## Post-Deployment
After deployment, save contract addresses and add them to your .env file.
Share addresses in the GDEG community for testing.
