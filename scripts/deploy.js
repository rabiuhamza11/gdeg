const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying GDEG Smart Contracts...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  
  // Deploy NodeRegistry
  const NodeRegistry = await ethers.getContractFactory("NodeRegistry");
  const registry = await NodeRegistry.deploy();
  await registry.waitForDeployment();
  console.log("NodeRegistry deployed:", await registry.getAddress());
  
  // Deploy EnergyToken
  const EnergyToken = await ethers.getContractFactory("EnergyToken");
  const token = await EnergyToken.deploy(deployer.address, await registry.getAddress());
  await token.waitForDeployment();
  console.log("EnergyToken (ECT) deployed:", await token.getAddress());
  
  // Deploy TradingEngine (requires USDC address for network)
  const USDC_POLYGON = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Polygon USDC
  const TradingEngine = await ethers.getContractFactory("TradingEngine");
  const trading = await TradingEngine.deploy(
    await token.getAddress(),
    USDC_POLYGON,
    deployer.address // treasury
  );
  await trading.waitForDeployment();
  console.log("TradingEngine deployed:", await trading.getAddress());
  
  console.log("\n=== GDEG Deployment Complete ===");
  console.log("NodeRegistry:", await registry.getAddress());
  console.log("EnergyToken:", await token.getAddress());
  console.log("TradingEngine:", await trading.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
