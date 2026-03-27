import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/api.js";
import { startListener } from "./listener.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/sharpredict";

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
    res.send({ status: "SharPredict Indexer API is running" });
});

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");

        // Start Ethers.js Listener
        startListener();

        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });
