import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
    firstName?: string;
    lastName?: string;
    email: string;
    password?: string;
    role: 'admin' | 'founder' | 'talent' | 'teen' | 'parent' | 'company' | 'mentor';
    isVerified: boolean;
    auth0Id?: string;

    // Module Access Control
    moduleAccess: ('incubator' | 'collab' | 'skillswap')[];

    // Profile completion tracking
    isProfileComplete?: boolean;

    // Student/Teen Specific Fields
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
        accountId?: mongoose.Types.ObjectId;
    };
    consentStatus?: 'pending' | 'verified' | 'limited' | 'revoked';

    // Company Specific Fields
    companyName?: string;
    businessType?: string;
    companyVerified?: boolean;

    // Matching Profile
    interests?: string[];
    skills?: { name: string; level: 'beginner' | 'intermediate' | 'advanced' }[];
    learningStyle?: 'Visual' | 'Practical' | 'Theoretical' | 'Collaborative';

    // Gamification Profile
    xp?: number;
    level?: number;
    badges?: {
        id: string;
        name: string;
        icon: string;
        unlockedAt: Date;
        nftHash?: string;
    }[];
    loginStreak?: number;
    lastLoginDate?: Date;
    achievements?: string[];

    // Auth0 / Session management
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
        minlength: [8, 'Password must be at least 8 characters'],
        select: false
    },
    auth0Id: {
        type: String,
        unique: true,
        sparse: true
    },
    role: {
        type: String,
        enum: ['admin', 'founder', 'talent', 'teen', 'parent', 'company', 'mentor'],
        required: true,
        default: 'talent'
    },
    moduleAccess: {
        type: [String],
        enum: ['incubator', 'collab', 'skillswap'],
        default: []
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isProfileComplete: {
        type: Boolean,
        default: false
    },

    // Student/Teen Specific Fields
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

    // Company Specific Fields
    companyName: String,
    businessType: String,
    companyVerified: { type: Boolean, default: false },

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

    // Gamification Profile
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: [{
        id: String,
        name: String,
        icon: String,
        unlockedAt: { type: Date, default: Date.now },
        nftHash: String
    }],
    loginStreak: { type: Number, default: 0 },
    lastLoginDate: Date,
    achievements: [String],

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

// Password hashing skip if using Auth0 (no password)
UserSchema.pre('save', async function () {
    if (!this.password || !this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error: any) {
        throw error;
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
