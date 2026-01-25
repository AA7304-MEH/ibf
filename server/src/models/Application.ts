import mongoose from 'mongoose';

export interface IApplication extends mongoose.Document {
    startup: mongoose.Types.ObjectId;
    founder: mongoose.Types.ObjectId;
    status: 'draft' | 'submitted' | 'reviewed' | 'interviewed' | 'accepted' | 'rejected';
    submissionDate?: Date;
    scores?: {
        team: number;
        product: number;
        market: number;
        total: number;
    };
    reviewerNotes: {
        reviewer: mongoose.Types.ObjectId;
        note: string;
        date: Date;
    }[];
    votes: {
        reviewer: mongoose.Types.ObjectId;
        vote: 'yes' | 'no' | 'maybe';
        date: Date;
    }[];
    interview?: {
        scheduled?: Date;
        completed: boolean;
        notes?: string;
        recording?: string;
    };
}

const ApplicationSchema = new mongoose.Schema<IApplication>({
    startup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Startup',
        required: true
    },
    founder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'submitted', 'reviewed', 'interviewed', 'accepted', 'rejected'],
        default: 'draft'
    },
    submissionDate: Date,
    scores: {
        team: { type: Number, min: 0, max: 10 },
        product: { type: Number, min: 0, max: 10 },
        market: { type: Number, min: 0, max: 10 },
        total: Number
    },
    reviewerNotes: [{
        reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        note: String,
        date: { type: Date, default: Date.now }
    }],
    votes: [{
        reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        vote: { type: String, enum: ['yes', 'no', 'maybe'] },
        date: { type: Date, default: Date.now }
    }],
    interview: {
        scheduled: Date,
        completed: { type: Boolean, default: false },
        notes: String,
        recording: String
    }
}, { timestamps: true });

// Prevent duplicate applications for same startup
ApplicationSchema.index({ startup: 1 }, { unique: true });

export default mongoose.model<IApplication>('Application', ApplicationSchema);
