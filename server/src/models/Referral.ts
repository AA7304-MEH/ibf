import mongoose, { Document, Schema } from 'mongoose';

export interface IReferral extends Document {
    referrerId: mongoose.Types.ObjectId; // The user who invited
    referredId: mongoose.Types.ObjectId; // The new user
    earnings: number; // total earnings from this specific referral in paise
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}

const ReferralSchema: Schema = new Schema({
    referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    referredId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, // A user can only be referred once
    earnings: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

ReferralSchema.index({ referrerId: 1 });

export default mongoose.model<IReferral>('Referral', ReferralSchema);
