import mongoose from 'mongoose';

export interface IAchievement extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    type: 'badge' | 'milestone' | 'streak';
    title: string;
    description: string;
    xpAwarded: number;
    icon: string; // URL or icon name
    earnedAt: Date;
}

const AchievementSchema = new mongoose.Schema<IAchievement>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['badge', 'milestone', 'streak'],
        required: true
    },
    title: { type: String, required: true },
    description: String,
    xpAwarded: { type: Number, default: 0 },
    icon: String,
    earnedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAchievement>('Achievement', AchievementSchema);
