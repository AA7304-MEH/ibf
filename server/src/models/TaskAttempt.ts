import mongoose, { Document, Schema } from 'mongoose';

export interface ITaskAttempt extends Document {
    userId: mongoose.Types.ObjectId;
    taskId: mongoose.Types.ObjectId;
    answers: mongoose.Schema.Types.Mixed; // flexible object/string based on formFields
    proofUrl?: string;
    status: 'pending' | 'approved' | 'rejected';
    reward: number; // captured at the time of completion
    completedAt: Date;
    reviewedAt?: Date;
    reviewedBy?: mongoose.Types.ObjectId; // admin who reviewed it
    adminNotes?: string;
}

const TaskAttemptSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    answers: { type: mongoose.Schema.Types.Mixed, required: true },
    proofUrl: { type: String },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    reward: { type: Number, required: true, min: 0 },
    completedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    adminNotes: { type: String }
}, {
    timestamps: true
});

// User can only attempt a specific task once
TaskAttemptSchema.index({ userId: 1, taskId: 1 }, { unique: true });
TaskAttemptSchema.index({ status: 1 });

export default mongoose.model<ITaskAttempt>('TaskAttempt', TaskAttemptSchema);
