import mongoose from 'mongoose';

export interface ITalentProfile extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    headline: string;
    bio: string;
    skills: {
        name: string;
        level: 'beginner' | 'intermediate' | 'expert';
        years: number;
    }[];
    rates: {
        hourly: number;
        projectMin?: number;
    };
    availability: {
        status: 'available' | 'booked' | 'unavailable';
        nextAvailable?: Date;
        hoursPerWeek: number;
    };
    portfolio: {
        title: string;
        description: string;
        url?: string;
        images?: string[];
        year?: number;
    }[];
    statistics: {
        successScore: number;
        completedProjects: number;
        responseRate: number; // Percentage
    };
    badges: string[];
}

const TalentProfileSchema = new mongoose.Schema<ITalentProfile>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    headline: {
        type: String,
        required: true,
        maxlength: 100
    },
    bio: {
        type: String,
        required: true,
        maxlength: 2000
    },
    skills: [{
        name: String,
        level: { type: String, enum: ['beginner', 'intermediate', 'expert'] },
        years: Number
    }],
    rates: {
        hourly: { type: Number, required: true },
        projectMin: Number
    },
    availability: {
        status: {
            type: String,
            enum: ['available', 'booked', 'unavailable'],
            default: 'available'
        },
        nextAvailable: Date,
        hoursPerWeek: Number
    },
    portfolio: [{
        title: String,
        description: String,
        url: String,
        images: [String],
        year: Number
    }],
    statistics: {
        successScore: { type: Number, default: 100 },
        completedProjects: { type: Number, default: 0 },
        responseRate: { type: Number, default: 100 }
    },
    badges: [String]
}, { timestamps: true });

export default mongoose.model<ITalentProfile>('TalentProfile', TalentProfileSchema);
