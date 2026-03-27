// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SyndicateMock
 * @dev Proof of concept for V2 Polymarket-Killer integration.
 * Allows users to pool funds into a "Syndicate" controlled by an expert trader.
 * Automatically mirrors the lead trader's predictions, deducting a 5% performance fee on wins.
 */
contract SyndicateMock is Ownable {
    mapping(address => uint256) public deposits;
    address public leadTrader;
    uint256 public performanceFeeBps = 500; // 5%

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event TradeMirrored(address indexed market, uint256 totalAmount, uint8 outcome);

    constructor(address _leadTrader) Ownable(msg.sender) {
        leadTrader = _leadTrader;
    }

    receive() external payable {
        deposit();
    }

    function deposit() public payable {
        require(msg.value > 0, "Must deposit SHM");
        deposits[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        require(deposits[msg.sender] >= amount, "Insufficient deposit");
        deposits[msg.sender] -= amount;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @dev Called by the Lead Trader. Routes the syndicate's pooled liquidity 
     * into the target PredictionMarket contract for the chosen outcome.
     */
    function mirrorTrade(address predictionMarket, uint8 outcome) external {
        require(msg.sender == leadTrader, "Only lead trader can execute");
        uint256 totalPool = address(this).balance;
        
        // In production: PredictionMarket(predictionMarket).placeBet{value: totalPool}(outcome);
        
        emit TradeMirrored(predictionMarket, totalPool, outcome);
    }
}
