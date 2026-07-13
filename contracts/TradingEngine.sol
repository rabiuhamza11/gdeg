// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title GDEG Trading Engine
/// @notice Peer-to-peer energy credit trading with escrow settlement
contract TradingEngine is ReentrancyGuard, Pausable, Ownable {
    
    IERC20 public energyToken;   // ECT
    IERC20 public paymentToken;  // USDC
    
    uint256 public platformFeeBps = 150; // 1.5%
    address public treasury;
    uint256 public orderCount;
    
    enum OrderStatus { Open, Filled, Cancelled, Expired }
    
    struct Order {
        uint256 orderId;
        address seller;
        address buyer;
        uint256 ectAmount;
        uint256 pricePerEct;  // in USDC (6 decimals)
        uint256 totalPrice;
        OrderStatus status;
        uint256 createdAt;
        uint256 expiresAt;
    }
    
    mapping(uint256 => Order) public orders;
    mapping(address => uint256[]) public sellerOrders;
    mapping(address => uint256[]) public buyerOrders;
    
    event OrderCreated(uint256 indexed orderId, address indexed seller, uint256 ectAmount, uint256 pricePerEct);
    event OrderFilled(uint256 indexed orderId, address indexed buyer, uint256 totalPrice);
    event OrderCancelled(uint256 indexed orderId);
    event FeesCollected(uint256 orderId, uint256 feeAmount);
    
    constructor(address _energyToken, address _paymentToken, address _treasury) 
        Ownable(msg.sender) 
    {
        energyToken = IERC20(_energyToken);
        paymentToken = IERC20(_paymentToken);
        treasury = _treasury;
    }
    
    /// @notice Seller lists ECT for sale
    function createOrder(uint256 ectAmount, uint256 pricePerEct, uint256 durationHours) 
        external 
        whenNotPaused 
        nonReentrant 
    {
        require(ectAmount > 0, "Trading: zero amount");
        require(pricePerEct > 0, "Trading: zero price");
        require(energyToken.balanceOf(msg.sender) >= ectAmount, "Trading: insufficient ECT");
        
        energyToken.transferFrom(msg.sender, address(this), ectAmount);
        
        orderCount++;
        uint256 totalPrice = (ectAmount * pricePerEct) / 1e18;
        
        orders[orderCount] = Order({
            orderId: orderCount,
            seller: msg.sender,
            buyer: address(0),
            ectAmount: ectAmount,
            pricePerEct: pricePerEct,
            totalPrice: totalPrice,
            status: OrderStatus.Open,
            createdAt: block.timestamp,
            expiresAt: block.timestamp + (durationHours * 1 hours)
        });
        
        sellerOrders[msg.sender].push(orderCount);
        emit OrderCreated(orderCount, msg.sender, ectAmount, pricePerEct);
    }
    
    /// @notice Buyer fills an open order
    function fillOrder(uint256 orderId) 
        external 
        whenNotPaused 
        nonReentrant 
    {
        Order storage order = orders[orderId];
        require(order.status == OrderStatus.Open, "Trading: order not open");
        require(block.timestamp <= order.expiresAt, "Trading: order expired");
        require(msg.sender != order.seller, "Trading: seller cannot buy own order");
        
        uint256 fee = (order.totalPrice * platformFeeBps) / 10000;
        uint256 sellerAmount = order.totalPrice - fee;
        
        paymentToken.transferFrom(msg.sender, order.seller, sellerAmount);
        paymentToken.transferFrom(msg.sender, treasury, fee);
        energyToken.transfer(msg.sender, order.ectAmount);
        
        order.buyer = msg.sender;
        order.status = OrderStatus.Filled;
        buyerOrders[msg.sender].push(orderId);
        
        emit OrderFilled(orderId, msg.sender, order.totalPrice);
        emit FeesCollected(orderId, fee);
    }
    
    /// @notice Seller cancels an open order
    function cancelOrder(uint256 orderId) external nonReentrant {
        Order storage order = orders[orderId];
        require(order.seller == msg.sender, "Trading: not order owner");
        require(order.status == OrderStatus.Open, "Trading: order not open");
        
        order.status = OrderStatus.Cancelled;
        energyToken.transfer(msg.sender, order.ectAmount);
        
        emit OrderCancelled(orderId);
    }
    
    function setFee(uint256 newFeeBps) external onlyOwner {
        require(newFeeBps <= 500, "Trading: fee too high");
        platformFeeBps = newFeeBps;
    }
    
    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
}
