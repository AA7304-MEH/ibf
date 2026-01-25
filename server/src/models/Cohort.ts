import mongoose from 'mongoose';

export interface ICohort extends mongoose.Document {
    name: string; // e.g. "Winter 2024"
    startDate: Date;
    endDate: Date;
    demoDay?: Date;
    startups: mongoose.Types.ObjectId[];
    mentors: mongoose.Types.ObjectId[];
    status: 'upcoming' | 'active' | 'completed';
}

const CohortSchema = new mongoose.Schema<ICohort>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    demoDay: Date,
    startups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Startup'
    }],
    mentors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['upcoming', 'active', 'completed'],
        default: 'upcoming'
    }
}, { timestamps: true });

export default mongoose.model<ICohort>('Cohort', CohortSchema);
