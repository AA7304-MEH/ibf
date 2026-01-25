import mongoose from 'mongoose';

export interface IReview extends mongoose.Document {
    contract: mongoose.Types.ObjectId;
    reviewer: mongoose.Types.ObjectId;
    reviewee: mongoose.Types.ObjectId;
    rating: number; // 1-5
    comment: string;
    role: 'client' | 'freelancer';
}

const ReviewSchema = new mongoose.Schema<IReview>({
    contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 500 },
    role: { type: String, enum: ['client', 'freelancer'], required: true }
}, { timestamps: true });

export default mongoose.model<IReview>('Review', ReviewSchema);
