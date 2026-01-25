import mongoose from 'mongoose';

export interface ISkillAssessment extends mongoose.Document {
    title: string;
    description: string;
    category: 'technical' | 'creative' | 'business' | 'soft-skills';
    skillsTargeted: string[];
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
    estimatedDurationMinutes: number;
    questions: {
        text: string;
        type: 'multiple-choice' | 'scale' | 'coding' | 'scenario';
        options?: {
            text: string;
            value: any;
            weight: number; // How much this option contributes to the score
        }[];
        correctAnswer?: any; // For objective questions
        skillTag: string; // Specific skill this question measures
        weight: number;
    }[];
    logic: {
        cutoffScore: number; // Score needed to "pass" or achieve level
        mapping: {
            rangeStart: number;
            rangeEnd: number;
            resultingLevel: string; // e.g., "Beginner - Tier 2"
        }[];
    };
    createdby: mongoose.Types.ObjectId;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const SkillAssessmentSchema = new mongoose.Schema<ISkillAssessment>({
    title: { type: String, required: true },
    description: String,
    category: {
        type: String,
        enum: ['technical', 'creative', 'business', 'soft-skills'],
        required: true
    },
    skillsTargeted: [String],
    difficultyLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    estimatedDurationMinutes: Number,
    questions: [{
        text: { type: String, required: true },
        type: {
            type: String,
            enum: ['multiple-choice', 'scale', 'coding', 'scenario'],
            required: true
        },
        options: [{
            text: String,
            value: mongoose.Schema.Types.Mixed,
            weight: Number
        }],
        correctAnswer: mongoose.Schema.Types.Mixed,
        skillTag: String,
        weight: { type: Number, default: 1 }
    }],
    logic: {
        cutoffScore: Number,
        mapping: [{
            rangeStart: Number,
            rangeEnd: Number,
            resultingLevel: String
        }]
    },
    createdby: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

export default mongoose.model<ISkillAssessment>('SkillAssessment', SkillAssessmentSchema);
