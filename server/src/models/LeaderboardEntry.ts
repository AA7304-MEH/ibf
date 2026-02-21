import mongoose, { Document, Schema } from 'mongoose';

export interface ILeaderboardEntry extends Document {
    userId: mongoose.Types.ObjectId;
    xp: number;
    level: number;
    streak: number;
    badgeCount: number;
    internshipsCompleted: number;
    rank: number;
    scope: 'global' | 'school' | 'regional';
    schoolId?: mongoose.Types.ObjectId;
    region?: string;
    updatedAt: Date;
}

const LeaderboardEntrySchema = new Schema<ILeaderboardEntry>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    badgeCount: { type: Number, default: 0 },
    internshipsCompleted: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    scope: {
        type: String,
        enum: ['global', 'school', 'regional'],
        default: 'global'
    },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School' },
    region: { type: String },
}, { timestamps: true });

// Indexes for fast leaderboard queries
LeaderboardEntrySchema.index({ scope: 1, xp: -1 });
LeaderboardEntrySchema.index({ schoolId: 1, xp: -1 });
LeaderboardEntrySchema.index({ region: 1, xp: -1 });

export default mongoose.model<ILeaderboardEntry>('LeaderboardEntry', LeaderboardEntrySchema);
