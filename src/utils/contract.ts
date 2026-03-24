export const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Placeholder

export const CONTRACT_ABI = [
  // Simplified ABI for prediction market
  "function createMarket(string title, string description, string category, uint256 endDate, uint256 resolutionMethod) public payable returns (uint256)",
  "function placeBet(uint256 marketId, bool side) public payable",
  "function claimReward(uint256 marketId) public",
  "function submitVote(uint256 marketId, bool side) public",
  "event MarketCreated(uint256 indexed marketId, string title, address creator)",
  "event BetPlaced(uint256 indexed marketId, address indexed user, bool side, uint256 amount)",
];
