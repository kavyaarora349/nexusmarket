import mongoose from "mongoose";

const BetSchema = new mongoose.Schema({
    marketId: { type: Number, required: true, index: true },
    user: { type: String, required: true, index: true },
    side: { type: Number, required: true },
    amount: { type: String, required: true },
    claimed: { type: Boolean, default: false },
    txHash: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model("Bet", BetSchema);
