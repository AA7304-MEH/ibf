import mongoose from 'mongoose';

export interface ILearningPath extends mongoose.Document {
    studentId: mongoose.Types.ObjectId;
    title: string; // e.g., "Full Stack Web Developer Path"
    status: 'active' | 'completed' | 'paused';
    startDate: Date;
    targetCompletionDate?: Date;

    // Skill DNA Profile (Snapshot at creation)
    skillDNA: {
        technicalProfile: Map<string, number>; // skill -> level
        learningStyle: string;
        gaps: {
            skill: string;
            gapSize: number;
        }[];
    };

    // The Roadmap Graph/Tree
    milestones: {
        id: string;
        title: string; // e.g., "Learn React Basics"
        type: 'skill' | 'project' | 'certification';
        status: 'locked' | 'available' | 'in-progress' | 'completed';
        prerequisites: string[]; // IDs of milestones that must be done first
        resources: {
            title: string;
            url: string;
            type: 'video' | 'article' | 'project-link';
        }[];
        skillReward?: {
            skill: string;
            points: number;
        };
        completedAt?: Date;
    }[];

    currentFocus: string[]; // IDs of currently active milestones
    progress: number; // 0-100 percentage

    createdAt: Date;
    updatedAt: Date;
}

const LearningPathSchema = new mongoose.Schema<ILearningPath>({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    status: {
        type: String,
        enum: ['active', 'completed', 'paused'],
        default: 'active'
    },
    startDate: { type: Date, default: Date.now },
    targetCompletionDate: Date,

    skillDNA: {
        technicalProfile: { type: Map, of: Number },
        learningStyle: String,
        gaps: [{
            skill: String,
            gapSize: Number
        }]
    },

    milestones: [{
        id: String,
        title: String,
        type: { type: String, enum: ['skill', 'project', 'certification'] },
        status: {
            type: String,
            enum: ['locked', 'available', 'in-progress', 'completed'],
            default: 'locked'
        },
        prerequisites: [String],
        resources: [{
            title: String,
            url: String,
            type: { type: String, enum: ['video', 'article', 'project-link'] }
        }],
        skillReward: {
            skill: String,
            points: Number
        },
        completedAt: Date
    }],

    currentFocus: [String],
    progress: { type: Number, default: 0 }
}, {
    timestamps: true
});

export default mongoose.model<ILearningPath>('LearningPath', LearningPathSchema);
