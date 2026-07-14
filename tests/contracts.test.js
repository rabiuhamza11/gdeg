const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GDEG Smart Contracts", function () {
  let owner, producer, consumer, treasury;
  let nodeRegistry, energyToken, tradingEngine;

  beforeEach(async function () {
    [owner, producer, consumer, treasury] = await ethers.getSigners();

    const NodeRegistry = await ethers.getContractFactory("NodeRegistry");
    nodeRegistry = await NodeRegistry.deploy();

    const EnergyToken = await ethers.getContractFactory("EnergyToken");
    energyToken = await EnergyToken.deploy(owner.address, await nodeRegistry.getAddress());

    // Use USDC mock — just use energyToken as payment for testing
    const TradingEngine = await ethers.getContractFactory("TradingEngine");
    tradingEngine = await TradingEngine.deploy(
      await energyToken.getAddress(),
      await energyToken.getAddress(), // mock USDC
      treasury.address
    );
  });

  describe("NodeRegistry", function () {
    it("Should register a node", async function () {
      await nodeRegistry.connect(producer).registerNode(
        "NODE-001", "Nigeria", "Lagos", 0, 500
      );
      const node = await nodeRegistry.getNode("NODE-001");
      expect(node.owner).to.equal(producer.address);
      expect(node.capacityKwh).to.equal(500);
    });

    it("Should verify a node", async function () {
      await nodeRegistry.connect(producer).registerNode("NODE-002", "Nigeria", "Abuja", 0, 300);
      await nodeRegistry.connect(owner).verifyNode("NODE-002");
      const node = await nodeRegistry.getNode("NODE-002");
      expect(node.verified).to.equal(true);
    });
  });

  describe("EnergyToken (EBT)", function () {
    it("Should mint EBT for a producer", async function () {
      await energyToken.connect(owner).mintEnergy(producer.address, 100, "NODE-001");
      const balance = await energyToken.balanceOf(producer.address);
      expect(balance).to.equal(ethers.parseEther("100"));
    });

    it("Should burn EBT on consumption", async function () {
      await energyToken.connect(owner).mintEnergy(producer.address, 100, "NODE-001");
      await energyToken.connect(owner).burnEnergy(producer.address, 50);
      const balance = await energyToken.balanceOf(producer.address);
      expect(balance).to.equal(ethers.parseEther("50"));
    });
  });

  describe("TradingEngine", function () {
    it("Should create an order", async function () {
      await energyToken.connect(owner).mintEnergy(producer.address, 1000, "NODE-001");
      await energyToken.connect(producer).approve(await tradingEngine.getAddress(), ethers.parseEther("500"));
      await tradingEngine.connect(producer).createOrder(ethers.parseEther("500"), ethers.parseUnits("0.08", 6), 24);
      const order = await tradingEngine.orders(1);
      expect(order.seller).to.equal(producer.address);
    });
  });
});
