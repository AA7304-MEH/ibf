import mongoose from 'mongoose';

export interface IStartup extends mongoose.Document {
    name: string;
    logo?: string;
    tagline: string;
    description: string;
    problem: string;
    solution: string;
    marketSize?: number;
    businessModel?: string;
    stage: 'idea' | 'prototype' | 'mvp' | 'launched' | 'scaling';
    team: {
        name: string;
        role: string;
        linkedin?: string;
        bio?: string;
    }[];
    metrics?: {
        users?: number;
        revenue?: number;
        growthRate?: number;
    };
    incubatorStatus: 'applied' | 'review' | 'interview' | 'accepted' | 'rejected';
    cohort?: string; // e.g. "Winter 2024" or ObjectId ref
    founder: mongoose.Types.ObjectId;
    funding?: {
        amount?: number;
        equity?: number;
        valuation?: number;
        date?: Date;
    };
    mentors: mongoose.Types.ObjectId[];
    // Additional fields from original schema to keep backward compatibility or enhance
    pitch?: string;
    website?: string;
    industry?: string;
    createdAt: Date;
}

const StartupSchema = new mongoose.Schema<IStartup>({
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
    problem: String,
    solution: String,
    marketSize: Number,
    businessModel: String,
    stage: {
        type: String,
        enum: ['idea', 'prototype', 'mvp', 'launched', 'scaling'],
        default: 'idea'
    },
    team: [{
        name: String,
        role: String,
        linkedin: String,
        bio: String
    }],
    metrics: {
        users: Number,
        revenue: Number,
        growthRate: Number
    },
    incubatorStatus: {
        type: String,
        enum: ['applied', 'review', 'interview', 'accepted', 'rejected'],
        default: 'applied'
    },
    cohort: String,
    founder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    funding: {
        amount: Number,
        equity: Number,
        valuation: Number,
        date: Date
    },
    mentors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Keep pitch for compatibility as 'tagline' covers it but pitch might be longer
    pitch: String,
    website: String,
    industry: String
}, {
    timestamps: true
});

export default mongoose.model<IStartup>('Startup', StartupSchema);
