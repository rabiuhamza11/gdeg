// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/// @title Energy Credit Token (ECT)
/// @notice 1 ECT = 1 kWh of verified renewable energy
/// @dev ERC-20 token minted by verified oracle data
contract EnergyToken is ERC20, Ownable, Pausable {
    
    address public oracleAddress;
    address public nodeRegistry;
    
    mapping(address => uint256) public producerBalance;
    mapping(address => bool) public authorizedMinters;
    
    event EnergyMinted(address indexed producer, uint256 amount, string nodeId);
    event EnergyBurned(address indexed consumer, uint256 amount);
    event OracleUpdated(address indexed newOracle);
    
    modifier onlyMinter() {
        require(authorizedMinters[msg.sender], "ECT: not authorized minter");
        _;
    }
    
    constructor(address _oracle, address _registry) 
        ERC20("Energy Credit Token", "ECT") 
        Ownable(msg.sender) 
    {
        oracleAddress = _oracle;
        nodeRegistry = _registry;
        authorizedMinters[msg.sender] = true;
    }
    
    /// @notice Mint ECT when oracle confirms energy production
    function mintEnergy(address producer, uint256 kwhAmount, string calldata nodeId) 
        external 
        onlyMinter 
        whenNotPaused 
    {
        require(producer != address(0), "ECT: invalid producer");
        require(kwhAmount > 0, "ECT: zero amount");
        _mint(producer, kwhAmount * 1e18);
        producerBalance[producer] += kwhAmount;
        emit EnergyMinted(producer, kwhAmount, nodeId);
    }
    
    /// @notice Burn ECT on energy consumption/settlement
    function burnEnergy(address consumer, uint256 kwhAmount) 
        external 
        onlyMinter 
        whenNotPaused 
    {
        require(balanceOf(consumer) >= kwhAmount * 1e18, "ECT: insufficient balance");
        _burn(consumer, kwhAmount * 1e18);
        emit EnergyBurned(consumer, kwhAmount);
    }
    
    function setOracle(address _oracle) external onlyOwner {
        oracleAddress = _oracle;
        emit OracleUpdated(_oracle);
    }
    
    function setMinter(address minter, bool status) external onlyOwner {
        authorizedMinters[minter] = status;
    }
    
    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
}
