import mongoose, { Document, Schema } from 'mongoose';

export interface IUserBadge extends Document {
    userId: mongoose.Types.ObjectId;
    badgeId: mongoose.Types.ObjectId;
    earnedAt: Date;
    nftMinted: boolean;
    nftTransactionHash?: string;
}

const UserBadgeSchema = new Schema<IUserBadge>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    badgeId: { type: Schema.Types.ObjectId, ref: 'Badge', required: true },
    earnedAt: { type: Date, default: Date.now },
    nftMinted: { type: Boolean, default: false },
    nftTransactionHash: { type: String },
}, { timestamps: true });

// Compound index for unique user-badge pair
UserBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

export default mongoose.model<IUserBadge>('UserBadge', UserBadgeSchema);
