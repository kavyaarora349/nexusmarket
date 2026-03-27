import mongoose from "mongoose";

const MarketSchema = new mongoose.Schema({
    marketId: { type: Number, required: true, unique: true },
    creator: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    endTime: { type: Number, required: true },
    resolutionType: { type: Number, required: true },
    status: { type: Number, default: 0 }, // 0=OPEN, 1=PENDING, 2=RESOLVED, 3=CANCELLED
    outcome: { type: Number, default: 0 },
    totalYesAmount: { type: String, default: "0" },
    totalNoAmount: { type: String, default: "0" },
    evidenceURI: { type: String },
    category: { type: String }
}, { timestamps: true });

export default mongoose.model("Market", MarketSchema);
