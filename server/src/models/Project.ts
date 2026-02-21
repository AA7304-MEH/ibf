import mongoose from 'mongoose';

export interface IProject extends mongoose.Document {
    founderId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    skillsRequired: string[];
    duration: string;
    budget: number; // informational only
    status: 'open' | 'in_progress' | 'completed' | 'cancelled';
    hiredTalentId?: mongoose.Types.ObjectId;
    milestones: {
        title: string;
        completed: boolean;
        dueDate: Date;
    }[];
    reviews: {
        from: mongoose.Types.ObjectId;
        rating: number;
        comment: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new mongoose.Schema<IProject>({
    founderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    skillsRequired: [{
        type: String,
        trim: true
    }],
    duration: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['open', 'in_progress', 'completed', 'cancelled'],
        default: 'open'
    },
    hiredTalentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    milestones: [{
        title: { type: String, required: true },
        completed: { type: Boolean, default: false },
        dueDate: Date
    }],
    reviews: [{
        from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: String
    }]
}, {
    timestamps: true
});

// Indexes
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ skillsRequired: 1 });
ProjectSchema.index({ founderId: 1 });

export default mongoose.model<IProject>('Project', ProjectSchema);
