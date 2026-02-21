import mongoose from 'mongoose';

export interface IInternship extends mongoose.Document {
    companyId: mongoose.Types.ObjectId;
    teenId?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    skillsRequired: string[];
    durationWeeks: number;
    learningOutcomes: string[];
    status: 'open' | 'pending_parent' | 'in_progress' | 'completed' | 'cancelled';
    parentApproval: {
        required: boolean;
        approvedAt?: Date;
        parentId?: mongoose.Types.ObjectId;
    };
    milestones: {
        title: string;
        completed: boolean;
        dueDate: Date;
    }[];
    feedback: {
        rating?: number;
        comment?: string;
        fromCompany: boolean;
    }[];
    badgeIssued: boolean;
    badgeNFTId?: string; // Token ID on Polygon
    matchScore?: number;
    createdAt: Date;
    updatedAt: Date;
}

const InternshipSchema = new mongoose.Schema<IInternship>({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    teenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    skillsRequired: [String],
    durationWeeks: {
        type: Number,
        required: true
    },
    learningOutcomes: [String],
    status: {
        type: String,
        enum: ['open', 'pending_parent', 'in_progress', 'completed', 'cancelled'],
        default: 'open'
    },
    parentApproval: {
        required: { type: Boolean, default: true },
        approvedAt: Date,
        parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    milestones: [{
        title: { type: String, required: true },
        completed: { type: Boolean, default: false },
        dueDate: Date
    }],
    feedback: [{
        rating: Number,
        comment: String,
        fromCompany: { type: Boolean, default: true }
    }],
    badgeIssued: {
        type: Boolean,
        default: false
    },
    badgeNFTId: String
}, {
    timestamps: true
});

// Indexes
InternshipSchema.index({ status: 1 });
InternshipSchema.index({ companyId: 1 });
InternshipSchema.index({ teenId: 1 });

export default mongoose.model<IInternship>('Internship', InternshipSchema);
