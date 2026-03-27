// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IOracle {
    function getResult(uint256 marketId) external view returns (uint8);
}
