// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PredictionMarket.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarketFactory is Ownable {
    uint256 public nextMarketId;
    
    struct MarketInfo {
        uint256 id;
        string title;
        address marketAddress;
        address creator;
        uint256 endTime;
        string category;
    }

    MarketInfo[] public markets;
    mapping(string => uint256[]) public categoryToMarketIds;

    uint256 public constant MIN_LIQUIDITY = 0.1 ether;

    event MarketCreated(uint256 indexed id, address indexed creator, string title, uint256 endTime, address marketAddress);

    constructor() Ownable(msg.sender) {}

    function createMarket(
        string memory title,
        string memory description,
        string memory category,
        uint256 endTime,
        PredictionMarket.ResolutionType resolutionType
    ) external payable returns (address) {
        require(msg.value >= MIN_LIQUIDITY, "Insufficient initial liquidity");

        uint256 marketId = nextMarketId++;

        PredictionMarket newMarket = (new PredictionMarket){value: msg.value}(
            marketId,
            msg.sender,
            title,
            description,
            endTime,
            resolutionType,
            owner()
        );

        markets.push(MarketInfo({
            id: marketId,
            title: title,
            marketAddress: address(newMarket),
            creator: msg.sender,
            endTime: endTime,
            category: category
        }));

        categoryToMarketIds[category].push(marketId);

        emit MarketCreated(marketId, msg.sender, title, endTime, address(newMarket));

        return address(newMarket);
    }

    function getAllMarkets() external view returns (MarketInfo[] memory) {
        return markets;
    }

    function getMarketsByCategory(string memory category) external view returns (MarketInfo[] memory) {
        uint256[] memory ids = categoryToMarketIds[category];
        MarketInfo[] memory filtered = new MarketInfo[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            filtered[i] = markets[ids[i]];
        }
        return filtered;
    }
}
