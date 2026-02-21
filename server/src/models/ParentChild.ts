import mongoose from 'mongoose';

export interface IParentChild extends mongoose.Document {
    parentId: mongoose.Types.ObjectId;
    teenId: mongoose.Types.ObjectId;
    relationship: 'mother' | 'father' | 'guardian';
    settings: {
        dailyTimeLimit: number; // minutes
        spendingLimit: number; // INR
        contentFilters: string[];
        autoApprove: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
}

const ParentChildSchema = new mongoose.Schema<IParentChild>({
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    teenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    relationship: {
        type: String,
        enum: ['mother', 'father', 'guardian'],
        required: true
    },
    settings: {
        dailyTimeLimit: { type: Number, default: 120 }, // 2 hours default
        spendingLimit: { type: Number, default: 1000 }, // 1000 INR default
        contentFilters: [String],
        autoApprove: { type: Boolean, default: false }
    }
}, {
    timestamps: true
});

// Index for quick lookup of teen's parent or parent's teens
ParentChildSchema.index({ parentId: 1 });
ParentChildSchema.index({ teenId: 1 }, { unique: true });

export default mongoose.model<IParentChild>('ParentChild', ParentChildSchema);
