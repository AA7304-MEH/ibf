import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    role: 'admin' | 'founder' | 'talent' | 'student' | 'mentor';
    isVerified: boolean;
    // Profile completion tracking
    isProfileComplete?: boolean;

    // Student Specific Fields
    dateOfBirth?: Date;
    schoolDetails?: {
        name: string;
        grade: string;
        email?: string;
        idVerified?: boolean;
    };
    parentInfo?: {
        name: string;
        email: string;
        phone: string;
        relationship: string;
        accountId?: mongoose.Types.ObjectId; // If parent has their own account
    };
    consentStatus?: 'pending' | 'verified' | 'limited' | 'revoked';

    // Matching Profile
    interests?: string[];
    skills?: { name: string; level: 'beginner' | 'intermediate' | 'advanced' }[];
    learningStyle?: 'Visual' | 'Practical' | 'Theoretical' | 'Collaborative';

    // Legacy/Mixed fields (keeping for backward compatibility or standard auth)
    verificationToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    lastLogin: Date;
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>({
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'founder', 'talent', 'student', 'mentor'],
        required: true,
        default: 'talent'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isProfileComplete: {
        type: Boolean,
        default: false
    },

    // Student Specific Fields
    dateOfBirth: Date,
    schoolDetails: {
        name: String,
        grade: String,
        email: String,
        idVerified: { type: Boolean, default: false }
    },
    parentInfo: {
        name: String,
        email: String,
        phone: String,
        relationship: String,
        accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    consentStatus: {
        type: String,
        enum: ['pending', 'verified', 'limited', 'revoked'],
        default: 'pending'
    },

    // Matching Profile
    interests: [String],
    skills: [{
        name: String,
        level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' }
    }],
    learningStyle: {
        type: String,
        enum: ['Visual', 'Practical', 'Theoretical', 'Collaborative']
    },

    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add pre-save hook for password hashing
// Add pre-save hook for password hashing
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error: any) {
        throw error;
    }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
