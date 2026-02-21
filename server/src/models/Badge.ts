import mongoose, { Document, Schema } from 'mongoose';

export interface IBadge extends Document {
    name: string;
    description: string;
    icon: string;
    category: 'achievement' | 'skill' | 'milestone' | 'special' | 'event';
    xpRequired?: number;
    criteria: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    nftTokenId?: string; // For blockchain badges
    createdAt: Date;
}

const BadgeSchema = new Schema<IBadge>({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }, // Emoji or URL
    category: {
        type: String,
        enum: ['achievement', 'skill', 'milestone', 'special', 'event'],
        default: 'achievement'
    },
    xpRequired: { type: Number },
    criteria: { type: String, required: true },
    rarity: {
        type: String,
        enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
        default: 'common'
    },
    nftTokenId: { type: String },
}, { timestamps: true });

export default mongoose.model<IBadge>('Badge', BadgeSchema);
