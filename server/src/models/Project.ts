import mongoose from 'mongoose';

export interface IProject extends mongoose.Document {
    title: string;
    description: string;
    postedBy: mongoose.Types.ObjectId;
    skillsRequired: string[];
    projectType: 'general' | 'skillswap' | 'collab';

    // For SkillSwap projects only
    skillswapDetails?: {
        ageRange?: { min: number; max: number };
        educationalValue?: string;
        safetyLevel?: 'basic' | 'moderate' | 'high';
        difficultyTier?: 'Explorer' | 'Builder' | 'Creator' | 'Innovator';
        learningStyleTags?: ('Visual' | 'Practical' | 'Theoretical' | 'Collaborative')[];
        skillsToLearn?: string[];
    };

    // For Collab projects only (Marketplace)
    collabDetails?: {
        platform: 'web' | 'mobile' | 'design' | 'marketing' | 'other';
        experienceLevel: 'beginner' | 'intermediate' | 'expert';
        paymentType: 'fixed' | 'hourly' | 'equity' | 'rev-share';
        budgetRange?: { min: number; max: number }; // For display
        milestones?: {
            title: string;
            amount: number;
            dueDate?: Date;
            completed: boolean;
        }[];
    };

    duration: string;
    estimatedHours: number;
    compensation?: {
        type: 'fixed' | 'hourly' | 'equity' | 'unpaid';
        amount?: number;
        currency?: string;
        hourlyRate?: number;
    };
    status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
    visibility: 'public' | 'private' | 'ibf_only';
    applicationDeadline?: Date;
    tags: string[];
    metadata: {
        matchScore?: number;
        applicationsCount: number;
        viewsCount: number;
        lastMatchedAt?: Date;
    };
}

const ProjectSchema = new mongoose.Schema<IProject>({
    title: {
        type: String,
        required: [true, 'Title is required'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skillsRequired: [{
        type: String,
        trim: true
    }],
    projectType: {
        type: String,
        enum: ['general', 'skillswap', 'collab'], // Added collab
        required: true,
        default: 'collab'
    },
    skillswapDetails: {
        ageRange: { min: Number, max: Number },
        educationalValue: String,
        safetyLevel: { type: String, enum: ['basic', 'moderate', 'high'] },
        difficultyTier: {
            type: String,
            enum: ['Explorer', 'Builder', 'Creator', 'Innovator'],
            default: 'Explorer'
        },
        learningStyleTags: [{
            type: String,
            enum: ['Visual', 'Practical', 'Theoretical', 'Collaborative']
        }],
        skillsToLearn: [String]
    },
    collabDetails: {
        platform: { type: String, enum: ['web', 'mobile', 'design', 'marketing', 'other'] },
        experienceLevel: { type: String, enum: ['beginner', 'intermediate', 'expert'] },
        paymentType: { type: String, enum: ['fixed', 'hourly', 'equity', 'rev-share'] },
        budgetRange: { min: Number, max: Number },
        milestones: [{
            title: String,
            amount: Number,
            dueDate: Date,
            completed: { type: Boolean, default: false }
        }]
    },
    duration: {
        type: String,
        required: true
    },
    estimatedHours: Number,
    compensation: {
        type: {
            type: String,
            enum: ['fixed', 'hourly', 'equity', 'unpaid'],
            default: 'fixed'
        },
        amount: Number,
        hourlyRate: Number, // distinct from amount for clarity
        currency: {
            type: String,
            default: 'USD'
        }
    },
    status: {
        type: String,
        enum: ['draft', 'open', 'in_progress', 'completed', 'cancelled'],
        default: 'draft'
    },
    visibility: {
        type: String,
        enum: ['public', 'private', 'ibf_only'],
        default: 'public'
    },
    applicationDeadline: Date,
    tags: [String],
    metadata: {
        matchScore: Number,
        applicationsCount: { type: Number, default: 0 },
        viewsCount: { type: Number, default: 0 },
        lastMatchedAt: Date
    }
}, {
    timestamps: true
});

// Indexes
ProjectSchema.index({ status: 1, projectType: 1 });
ProjectSchema.index({ skillsRequired: 1 });
ProjectSchema.index({ postedBy: 1 });

export default mongoose.model<IProject>('Project', ProjectSchema);
