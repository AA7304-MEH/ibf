import mongoose from 'mongoose';

export interface IStartup extends mongoose.Document {
    founderId: mongoose.Types.ObjectId;
    name: string;
    logo?: string;
    tagline: string;
    description: string;
    industry: string;
    stage: 'idea' | 'prototype' | 'mvp' | 'launched' | 'revenue' | 'seriesA';
    teamSize: number;
    foundedDate: Date;
    metrics: {
        users: number;
        revenue: number;
        growthRate: number;
    };
    mentors: {
        mentorId: mongoose.Types.ObjectId;
        assignedAt: Date;
    }[];
    genomeAnalysis?: {
        marketFitScore: number;
        teamStrengthScore: number;
        tractionScore: number;
        competitorMap?: any;
        growthPredictor?: any;
        lastUpdated: Date;
    };
    incubatorStatus: 'applied' | 'review' | 'interview' | 'accepted' | 'rejected';
    cohort?: string;
    website?: string;
    createdAt: Date;
}

const StartupSchema = new mongoose.Schema<IStartup>({
    founderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Startup name is required'],
        trim: true
    },
    logo: String,
    tagline: {
        type: String,
        required: [true, 'Tagline is required'],
        maxlength: 140
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    industry: {
        type: String,
        required: true
    },
    stage: {
        type: String,
        enum: ['idea', 'prototype', 'mvp', 'launched', 'revenue', 'seriesA'],
        default: 'idea'
    },
    teamSize: {
        type: Number,
        default: 1
    },
    foundedDate: {
        type: Date,
        default: Date.now
    },
    metrics: {
        users: { type: Number, default: 0 },
        revenue: { type: Number, default: 0 },
        growthRate: { type: Number, default: 0 }
    },
    mentors: [{
        mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        assignedAt: { type: Date, default: Date.now }
    }],
    genomeAnalysis: {
        marketFitScore: Number,
        teamStrengthScore: Number,
        tractionScore: Number,
        competitorMap: mongoose.Schema.Types.Mixed,
        growthPredictor: mongoose.Schema.Types.Mixed,
        lastUpdated: { type: Date, default: Date.now }
    },
    incubatorStatus: {
        type: String,
        enum: ['applied', 'review', 'interview', 'accepted', 'rejected'],
        default: 'applied'
    },
    cohort: String,
    website: String
}, {
    timestamps: true
});

export default mongoose.model<IStartup>('Startup', StartupSchema);
