import { expect } from "chai";
import hardhat from "hardhat";
const { ethers } = hardhat;

describe("MarketFactory", function () {
    it("Should create a market and list it", async function () {
        const [owner, creator] = await ethers.getSigners();
        const MarketFactory = await ethers.getContractFactory("MarketFactory");
        const factory = await MarketFactory.deploy();

        const endTime = Math.floor(Date.now() / 1000) + 86400;

        await factory.connect(creator).createMarket(
            "Test Title",
            "Test Description",
            "Sports",
            endTime,
            1,
            { value: ethers.parseEther("0.1") }
        );

        const markets = await factory.getAllMarkets();
        expect(markets.length).to.equal(1);
        expect(markets[0].title).to.equal("Test Title");

        const categoryMarkets = await factory.getMarketsByCategory("Sports");
        expect(categoryMarkets.length).to.equal(1);
    });
});
