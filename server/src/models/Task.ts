import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
    module: 'incubator' | 'collab' | 'skillswap';
    title: string;
    description: string;
    instructions: string;
    type: 'captcha' | 'data_entry' | 'survey' | 'image_tagging' | 'file_upload' | 'custom';
    reward: number; // in paise
    totalQuantity: number;
    remainingQuantity: number;
    timeLimit?: number; // in minutes
    verificationType: 'auto' | 'manual';
    correctAnswer?: string; // hashed or exact string for auto
    formFields?: {
        label: string;
        type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox';
        options?: string[];
        required: boolean;
    }[];
    mediaUrl?: string; // For image tagging, captcha image, etc
    fileRequired: boolean;
    status: 'active' | 'paused' | 'expired' | 'completed';
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    expiresAt?: Date;
}

const TaskSchema: Schema = new Schema({
    module: {
        type: String,
        enum: ['incubator', 'collab', 'skillswap'],
        required: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructions: { type: String, required: true },
    type: {
        type: String,
        enum: ['captcha', 'data_entry', 'survey', 'image_tagging', 'file_upload', 'custom'],
        required: true
    },
    reward: { type: Number, required: true, min: 0 },
    totalQuantity: { type: Number, required: true, min: 1 },
    remainingQuantity: { type: Number, required: true, min: 0 },
    timeLimit: { type: Number },
    verificationType: {
        type: String,
        enum: ['auto', 'manual'],
        required: true
    },
    correctAnswer: { type: String },
    formFields: [{
        label: { type: String, required: true },
        type: { type: String, enum: ['text', 'number', 'textarea', 'select', 'radio', 'checkbox'], required: true },
        options: [String],
        required: { type: Boolean, default: true }
    }],
    mediaUrl: { type: String },
    fileRequired: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ['active', 'paused', 'expired', 'completed'],
        default: 'active'
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date }
}, {
    timestamps: true
});

// Index for faster queries on module and status
TaskSchema.index({ module: 1, status: 1 });
TaskSchema.index({ createdBy: 1 });

export default mongoose.model<ITask>('Task', TaskSchema);
