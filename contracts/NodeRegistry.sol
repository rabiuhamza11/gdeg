// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title GDEG Node Registry
/// @notice Registers and tracks decentralized energy producer nodes globally
contract NodeRegistry is Ownable {
    
    enum NodeStatus { Pending, Active, Suspended, Deactivated }
    enum EnergyType { Solar, Wind, Hydro, Geothermal, Biomass, Other }
    
    struct Node {
        string nodeId;
        address owner;
        string country;
        string region;
        EnergyType energyType;
        uint256 capacityKwh;
        uint256 totalProduced;
        NodeStatus status;
        uint256 registeredAt;
        bool verified;
    }
    
    mapping(string => Node) public nodes;
    mapping(address => string[]) public ownerNodes;
    string[] public allNodeIds;
    
    uint256 public totalNodes;
    uint256 public activeNodes;
    
    event NodeRegistered(string indexed nodeId, address indexed owner, string country);
    event NodeVerified(string indexed nodeId);
    event NodeStatusChanged(string indexed nodeId, NodeStatus newStatus);
    event EnergyProduced(string indexed nodeId, uint256 kwhAmount);
    
    constructor() Ownable(msg.sender) {}
    
    function registerNode(
        string calldata nodeId,
        string calldata country,
        string calldata region,
        EnergyType energyType,
        uint256 capacityKwh
    ) external {
        require(bytes(nodes[nodeId].nodeId).length == 0, "Registry: node exists");
        require(capacityKwh > 0, "Registry: zero capacity");
        
        nodes[nodeId] = Node({
            nodeId: nodeId,
            owner: msg.sender,
            country: country,
            region: region,
            energyType: energyType,
            capacityKwh: capacityKwh,
            totalProduced: 0,
            status: NodeStatus.Pending,
            registeredAt: block.timestamp,
            verified: false
        });
        
        ownerNodes[msg.sender].push(nodeId);
        allNodeIds.push(nodeId);
        totalNodes++;
        
        emit NodeRegistered(nodeId, msg.sender, country);
    }
    
    function verifyNode(string calldata nodeId) external onlyOwner {
        require(bytes(nodes[nodeId].nodeId).length > 0, "Registry: node not found");
        nodes[nodeId].verified = true;
        nodes[nodeId].status = NodeStatus.Active;
        activeNodes++;
        emit NodeVerified(nodeId);
    }
    
    function recordProduction(string calldata nodeId, uint256 kwhAmount) external onlyOwner {
        require(nodes[nodeId].status == NodeStatus.Active, "Registry: node not active");
        nodes[nodeId].totalProduced += kwhAmount;
        emit EnergyProduced(nodeId, kwhAmount);
    }
    
    function getNode(string calldata nodeId) external view returns (Node memory) {
        return nodes[nodeId];
    }
    
    function getOwnerNodes(address owner) external view returns (string[] memory) {
        return ownerNodes[owner];
    }
    
    function getTotalNodes() external view returns (uint256) {
        return totalNodes;
    }
}
