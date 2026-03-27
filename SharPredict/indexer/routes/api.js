import express from "express";
import Market from "../models/Market.js";
import Bet from "../models/Bet.js";
import OddsSnapshot from "../models/OddsSnapshot.js";
import { exec } from "child_process";

const router = express.Router();

router.get("/markets", async (req, res) => {
    try {
        const markets = await Market.find().sort({ createdAt: -1 });
        res.json(markets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/markets/:id", async (req, res) => {
    try {
        const market = await Market.findOne({ marketId: req.params.id });
        if (!market) return res.status(404).json({ error: "Not found" });
        res.json(market);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/markets/:id/odds", async (req, res) => {
    try {
        const odds = await OddsSnapshot.find({ marketId: req.params.id })
            .sort({ timestamp: -1 })
            .limit(100);
        res.json(odds);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/markets/:id/bets", async (req, res) => {
    try {
        const bets = await Bet.find({ marketId: req.params.id }).sort({ createdAt: -1 });
        res.json(bets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/user/:address", async (req, res) => {
    try {
        const bets = await Bet.find({ user: new RegExp(`^${req.params.address}$`, 'i') }).sort({ createdAt: -1 });
        res.json(bets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/markets/seed", (req, res) => {
    exec("npx hardhat run scripts/seed.js", (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message, stderr });
        }
        res.json({ message: "Seeded demo markets", output: stdout });
    });
});

export default router;
