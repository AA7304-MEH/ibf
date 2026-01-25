import mongoose from 'mongoose';

export interface IWellbeingMetrics extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    date: Date;
    screenTimeMinutes: number;
    focusSessionsCount: number;
    moodScore?: number; // 1-5
    lastHeartbeat: Date;
}

const WellbeingMetricsSchema = new mongoose.Schema<IWellbeingMetrics>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    screenTimeMinutes: { type: Number, default: 0 },
    focusSessionsCount: { type: Number, default: 0 },
    moodScore: { type: Number, min: 1, max: 5 },
    lastHeartbeat: { type: Date, default: Date.now }
});

// Compound index to ensure one record per user per day
WellbeingMetricsSchema.index({ userId: 1, date: 1 });

export default mongoose.model<IWellbeingMetrics>('WellbeingMetrics', WellbeingMetricsSchema);
