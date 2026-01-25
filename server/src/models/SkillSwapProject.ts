import mongoose from 'mongoose';

export interface ISkillSwapProject extends mongoose.Document {
    title: string;
    description: string;
    startupId: mongoose.Types.ObjectId;

    // Educational Framework
    difficultyTier: 'Explorer' | 'Builder' | 'Creator' | 'Innovator';
    learningStyleTags: ('Visual' | 'Practical' | 'Theoretical' | 'Collaborative')[];
    skillsRequired: {
        name: string;
        level: 'beginner' | 'intermediate' | 'advanced';
    }[];
    skillsToLearn: string[]; // Skills student will gain
    prerequisiteMilestones?: string[]; // IDs of LearningPath milestones

    learningObjectives: string[];
    deliverables: {
        name: string;
        description: string;
        format: string; // e.g. "Github Repo", "PDF", "Figma Link"
    }[];

    // Safety & Logistics
    estimatedHours: number;
    durationWeeks: number;
    isRemote: boolean;
    mentorId: mongoose.Types.ObjectId;
    parentApprovalRequired: boolean;

    status: 'draft' | 'open' | 'in-progress' | 'completed' | 'archived';

    // Matching Data
    targetAgeRange: { min: number, max: number };

    createdAt: Date;
    updatedAt: Date;
}

const SkillSwapProjectSchema = new mongoose.Schema<ISkillSwapProject>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },

    difficultyTier: {
        type: String,
        enum: ['Explorer', 'Builder', 'Creator', 'Innovator'],
        default: 'Explorer'
    },
    learningStyleTags: [{
        type: String,
        enum: ['Visual', 'Practical', 'Theoretical', 'Collaborative']
    }],
    skillsRequired: [{
        name: String,
        level: { type: String, enum: ['beginner', 'intermediate', 'advanced'] }
    }],
    skillsToLearn: [String],
    prerequisiteMilestones: [String],

    learningObjectives: [String],
    deliverables: [{
        name: String,
        description: String,
        format: String
    }],

    estimatedHours: Number,
    durationWeeks: Number,
    isRemote: { type: Boolean, default: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    parentApprovalRequired: { type: Boolean, default: true },

    status: {
        type: String,
        enum: ['draft', 'open', 'in-progress', 'completed', 'archived'],
        default: 'draft'
    },

    targetAgeRange: {
        min: { type: Number, default: 16 },
        max: { type: Number, default: 18 }
    }
}, {
    timestamps: true
});

export default mongoose.model<ISkillSwapProject>('SkillSwapProject', SkillSwapProjectSchema);
