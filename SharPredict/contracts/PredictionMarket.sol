// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PredictionMarket is ReentrancyGuard, Pausable, Ownable {
    enum ResolutionType { COMMUNITY, ADMIN, ORACLE }
    enum MarketStatus { OPEN, PENDING, RESOLVED, CANCELLED }

    struct Market {
        uint256 id;
        address creator;
        string title;
        string description;
        uint256 endTime;
        uint256 resolutionTime;
        ResolutionType resolutionType;
        MarketStatus status;
        uint8 outcome; // 0=unresolved, 1=YES, 2=NO
        uint256 totalYesAmount;
        uint256 totalNoAmount;
        string evidenceURI;
    }

    struct Position {
        address user;
        uint8 side; // 1=YES, 2=NO
        uint256 amount;
        bool claimed;
    }

    uint256 public constant MIN_BET = 0.01 ether; // 0.01 SHM
    uint256 public constant PLATFORM_FEE_PERCENT = 2; // 2%

    Market public market;
    mapping(address => Position) public positions;

    // Optional: for community voting
    mapping(address => uint8) public communityVotes;
    mapping(address => uint256) public communityStakes;
    uint256 public totalYesVotes;
    uint256 public totalNoVotes;

    event BetPlaced(uint256 indexed marketId, address indexed user, uint8 side, uint256 amount);
    event MarketResolved(uint256 indexed marketId, uint8 outcome, string evidenceURI);
    event RewardClaimed(uint256 indexed marketId, address indexed user, uint256 amount);
    event CommunityVoteSubmitted(uint256 indexed marketId, address indexed voter, uint8 vote, uint256 stake);
    event MarketCancelled(uint256 indexed marketId);

    constructor(
        uint256 _id,
        address _creator,
        string memory _title,
        string memory _description,
        uint256 _endTime,
        ResolutionType _resolutionType,
        address _owner
    ) payable Ownable(_owner) {
        require(_endTime > block.timestamp, "End time must be in future");
        market.id = _id;
        market.creator = _creator;
        market.title = _title;
        market.description = _description;
        market.endTime = _endTime;
        market.resolutionType = _resolutionType;
        market.status = MarketStatus.OPEN;
        
        if (msg.value > 0) {
            market.totalYesAmount += msg.value / 2;
            market.totalNoAmount += msg.value - (msg.value / 2);
        }
    }

    function placeBet(uint8 side) external payable nonReentrant whenNotPaused {
        require(market.status == MarketStatus.OPEN, "Market not OPEN");
        require(block.timestamp < market.endTime, "Market ended");
        require(msg.value >= MIN_BET, "Bet too low");
        require(side == 1 || side == 2, "Invalid side");

        if (positions[msg.sender].amount > 0) {
            require(positions[msg.sender].side == side, "Cannot bet both sides");
        }

        positions[msg.sender].user = msg.sender;
        positions[msg.sender].side = side;
        positions[msg.sender].amount += msg.value;

        if (side == 1) {
            market.totalYesAmount += msg.value;
        } else {
            market.totalNoAmount += msg.value;
        }

        emit BetPlaced(market.id, msg.sender, side, msg.value);
    }

    function submitCommunityVote(uint8 vote) external payable nonReentrant whenNotPaused {
        require(market.resolutionType == ResolutionType.COMMUNITY, "Not community resolution");
        require(block.timestamp >= market.endTime, "Market not ended");
        require(market.status == MarketStatus.OPEN || market.status == MarketStatus.PENDING, "Market resolved");
        require(vote == 1 || vote == 2, "Invalid vote");
        require(msg.value > 0, "Must stake to vote");

        market.status = MarketStatus.PENDING;

        communityVotes[msg.sender] = vote;
        communityStakes[msg.sender] += msg.value;

        if (vote == 1) {
            totalYesVotes += msg.value;
        } else {
            totalNoVotes += msg.value;
        }

        emit CommunityVoteSubmitted(market.id, msg.sender, vote, msg.value);
    }

    function resolveMarket(uint8 outcome, string memory evidenceURI) external onlyOwner {
        require(market.status == MarketStatus.OPEN || market.status == MarketStatus.PENDING, "Invalid status");
        require(block.timestamp >= market.endTime, "Market not ended");
        require(outcome == 1 || outcome == 2 || outcome == 3, "Invalid outcome"); // 3 could mean tie/cancel
        
        market.status = MarketStatus.RESOLVED;
        market.outcome = outcome;
        market.resolutionTime = block.timestamp;
        market.evidenceURI = evidenceURI;

        emit MarketResolved(market.id, outcome, evidenceURI);
    }

    function claimReward() external nonReentrant whenNotPaused {
        require(market.status == MarketStatus.RESOLVED || market.status == MarketStatus.CANCELLED, "Market not resolvable");
        Position storage userPos = positions[msg.sender];
        require(userPos.amount > 0, "No bet");
        require(!userPos.claimed, "Reward claimed");

        uint256 payout = 0;

        if (market.status == MarketStatus.CANCELLED || market.outcome == 3) {
            payout = userPos.amount;
        } else {
            require(userPos.side == market.outcome, "Did not win");
            
            uint256 winningPool = market.outcome == 1 ? market.totalYesAmount : market.totalNoAmount;
            uint256 losingPool = market.outcome == 1 ? market.totalNoAmount : market.totalYesAmount;

            uint256 userProportion = (userPos.amount * 1e18) / winningPool;
            uint256 totalWinnings = userPos.amount + ((losingPool * userProportion) / 1e18);
            
            uint256 fee = (totalWinnings * PLATFORM_FEE_PERCENT) / 100;
            payout = totalWinnings - fee;

            (bool feeSuccess, ) = owner().call{value: fee}("");
            require(feeSuccess, "Fee transfer failed");
        }

        userPos.claimed = true;
        (bool success, ) = msg.sender.call{value: payout}("");
        require(success, "Payout transfer failed");

        emit RewardClaimed(market.id, msg.sender, payout);
    }

    function cancelMarket() external {
        require(msg.sender == market.creator || msg.sender == owner(), "Not authorized");
        require(market.status == MarketStatus.OPEN, "Not OPEN");
        require(market.totalYesAmount == 0 && market.totalNoAmount == 0, "Bets exist");

        market.status = MarketStatus.CANCELLED;
        emit MarketCancelled(market.id);
    }

    function getMarket() external view returns (Market memory) {
        return market;
    }

    function getUserPosition(address user) external view returns (Position memory) {
        return positions[user];
    }

    function getMarketOdds() external view returns (uint256 yesPercent, uint256 noPercent) {
        uint256 total = market.totalYesAmount + market.totalNoAmount;
        if (total == 0) return (50, 50);
        yesPercent = (market.totalYesAmount * 100) / total;
        noPercent = (market.totalNoAmount * 100) / total;
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
}
