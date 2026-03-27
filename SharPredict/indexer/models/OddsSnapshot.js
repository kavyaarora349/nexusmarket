import mongoose from "mongoose";

const OddsSnapshotSchema = new mongoose.Schema({
    marketId: { type: Number, required: true, index: true },
    yesPercent: { type: Number, required: true },
    noPercent: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("OddsSnapshot", OddsSnapshotSchema);
