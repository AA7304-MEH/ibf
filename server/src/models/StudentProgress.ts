import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentProgress extends Document {
    studentId: mongoose.Types.ObjectId;
    learningPathId: string;
    progress: {
        overall: number;
        modules: {
            moduleId: number;
            completedLessons: number[]; // IDs of completed lessons
            progress: number;
            startedAt?: Date;
            completedAt?: Date;
            xpEarned: number;
        }[];
        streak: {
            current: number;
            longest: number;
            lastActive: Date;
        };
        totalHours: number;
        totalXP: number;
    };
    skillMetrics: {
        frontend: number;
        backend: number;
        database: number;
        problemSolving: number;
        creativity: number;
    };
    completedProjects: {
        projectId: string;
        title: string;
        completedAt: Date;
        skillsUsed: string[];
        reviewScore?: number;
        repositoryUrl?: string;
    }[];
    achievements: {
        achievementId: string;
        earnedAt: Date;
        badgeUrl?: string;
    }[];
}

const StudentProgressSchema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    learningPathId: { type: String, required: true, default: 'full-stack-dev' },
    progress: {
        overall: { type: Number, default: 0 },
        modules: [{
            _id: false,
            moduleId: Number,
            completedLessons: [Number],
            progress: Number,
            startedAt: Date,
            completedAt: Date,
            xpEarned: { type: Number, default: 0 }
        }],
        streak: {
            current: { type: Number, default: 0 },
            longest: { type: Number, default: 0 },
            lastActive: Date
        },
        totalHours: { type: Number, default: 0 },
        totalXP: { type: Number, default: 0 }
    },
    skillMetrics: {
        frontend: { type: Number, default: 0 },
        backend: { type: Number, default: 0 },
        database: { type: Number, default: 0 },
        problemSolving: { type: Number, default: 0 },
        creativity: { type: Number, default: 0 }
    },
    completedProjects: [{
        projectId: String,
        title: String,
        completedAt: Date,
        skillsUsed: [String],
        reviewScore: Number,
        repositoryUrl: String
    }],
    achievements: [{
        achievementId: String,
        earnedAt: Date,
        badgeUrl: String
    }]
}, { timestamps: true });

export default mongoose.model<IStudentProgress>('StudentProgress', StudentProgressSchema);
