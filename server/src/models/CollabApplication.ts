import mongoose from 'mongoose';

export interface ICollabApplication extends mongoose.Document {
    project: mongoose.Types.ObjectId;
    applicant: mongoose.Types.ObjectId; // User (Talent)
    coverLetter: string;
    proposedRate?: number;
    estimatedDuration?: string;
    attachments?: { name: string; url: string }[];
    status: 'pending' | 'viewed' | 'interview' | 'hired' | 'rejected' | 'withdrawn';
    messages: {
        sender: mongoose.Types.ObjectId;
        content: string;
        timestamp: Date;
    }[];
    createdAt: Date;
}

const CollabApplicationSchema = new mongoose.Schema<ICollabApplication>({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coverLetter: {
        type: String,
        required: true,
        maxlength: 2000
    },
    proposedRate: Number,
    estimatedDuration: String,
    attachments: [{
        name: String,
        url: String
    }],
    status: {
        type: String,
        enum: ['pending', 'viewed', 'interview', 'hired', 'rejected', 'withdrawn'],
        default: 'pending'
    },
    messages: [{
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: String,
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

// Prevent duplicate applications
CollabApplicationSchema.index({ project: 1, applicant: 1 }, { unique: true });

export default mongoose.model<ICollabApplication>('CollabApplication', CollabApplicationSchema);
