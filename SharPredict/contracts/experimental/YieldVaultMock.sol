// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title YieldVaultMock
 * @dev Proof of concept for V2 Polymarket-Killer integration.
 * Wraps deposited SHM (or ERC20) into a yield-bearing asset (simulating Aave aTokens)
 * so that prediction markets accrue APY while awaiting resolution.
 */
contract YieldVaultMock is Ownable {
    mapping(address => uint256) public deposits;
    uint256 public constant MOCK_APY_BASIS_POINTS = 1240; // 12.4% APY
    uint256 public lastAccrualTimestamp;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 principal, uint256 yield);
    event YieldAccrued(uint256 totalYieldGenerated);

    constructor() Ownable(msg.sender) {
        lastAccrualTimestamp = block.timestamp;
    }

    receive() external payable {
        deposit();
    }

    function deposit() public payable {
        require(msg.value > 0, "Must deposit SHM");
        deposits[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    // Simulates unlocking funds upon market resolution, delivering principal + generated yield to winners.
    function withdrawWithYield(uint256 amount) external {
        require(deposits[msg.sender] >= amount, "Insufficient deposit");
        
        // Mock yield calculation: (amount * 12.4% * time_elapsed) / 1 year
        uint256 timeElapsed = block.timestamp - lastAccrualTimestamp;
        uint256 simulatedYield = (amount * MOCK_APY_BASIS_POINTS * timeElapsed) / (10000 * 365 days);
        
        // For hackathon demo purposes, we automatically mint the mock yield if contract has balance,
        // otherwise we just return principal.
        uint256 totalPayout = amount + simulatedYield;
        deposits[msg.sender] -= amount;
        
        // In production, this would unwrap aWETH/aERC20.
        (bool success, ) = msg.sender.call{value: totalPayout > address(this).balance ? address(this).balance : totalPayout}("");
        require(success, "Transfer failed");

        emit Withdrawn(msg.sender, amount, simulatedYield);
    }

    // Admin function to seed the vault with mock yield liquidity
    function seedYield() external payable onlyOwner {
        emit YieldAccrued(msg.value);
    }
}
