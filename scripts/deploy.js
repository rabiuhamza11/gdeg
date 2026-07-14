const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  console.log("=== GDEG Smart Contract Deployment ===");
  console.log("Deployer:", deployer.address);
  console.log("Network:", network.name, "(Chain ID:", network.chainId.toString() + ")");
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "MATIC");
  
  if (balance === 0n) {
    console.error("ERROR: No MATIC balance. Fund your wallet from https://faucet.polygon.technology");
    process.exit(1);
  }

  // 1. Deploy NodeRegistry
  console.log("\n[1/2] Deploying NodeRegistry...");
  const NodeRegistry = await ethers.getContractFactory("NodeRegistry");
  const registry = await NodeRegistry.deploy();
  await registry.waitForDeployment();
  const registryAddr = await registry.getAddress();
  console.log("NodeRegistry deployed:", registryAddr);

  // 2. Deploy EnergyToken
  console.log("[2/2] Deploying EnergyToken (EBT)...");
  const EnergyToken = await ethers.getContractFactory("EnergyToken");
  const token = await EnergyToken.deploy();
  await token.waitForDeployment();
  const tokenAddr = await token.getAddress();
  console.log("EnergyToken (EBT) deployed:", tokenAddr);

  // 3. Register pilot node
  console.log("\nRegistering pilot node: NODE-LAGOS-001 (Solar, 500kW)...");
  const tx1 = await registry.registerNode("NODE-LAGOS-001", "Nigeria", "Lagos", 0, 500);
  await tx1.wait();
  console.log("Node registered.");

  // 4. Mint 1000 EBT test tokens
  console.log("Minting 1000 EBT to deployer (test)...");
  const tx2 = await token.mintEnergy(deployer.address, 1000, "NODE-LAGOS-001");
  await tx2.wait();
  console.log("1000 EBT minted to:", deployer.address);

  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log("NodeRegistry: ", registryAddr);
  console.log("EnergyToken:  ", tokenAddr);
  console.log("\nView on Amoy Explorer:");
  console.log("https://amoy.polygonscan.com/address/" + registryAddr);
  console.log("https://amoy.polygonscan.com/address/" + tokenAddr);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
