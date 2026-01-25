import mongoose from 'mongoose';

export interface IParentConsent extends mongoose.Document {
    studentId: mongoose.Types.ObjectId;
    parentId: mongoose.Types.ObjectId; // User ID of the parent account
    consentType: 'platform' | 'project-specific' | 'time-bound';
    status: 'pending' | 'active' | 'expired' | 'revoked';
    grantedDate?: Date;
    expiryDate?: Date;
    permissions: {
        canApplyProjects: boolean;
        canCommunicate: boolean;
        canSubmitWork: boolean;
        canReceiveCertificates: boolean;
    };
    projectApprovals: {
        projectId: mongoose.Types.ObjectId;
        status: 'pending' | 'approved' | 'denied';
        decisionDate?: Date;
        notes?: string;
    }[];
    activityLog: {
        action: string;
        timestamp: Date;
        ipAddress?: string;
        details?: any;
    }[];
    emergencySettings: {
        pauseEnabled: boolean;
        pauseUntil?: Date;
        alertPreferences: string[];
    };
    createdAt: Date;
    updatedAt: Date;
}

const ParentConsentSchema = new mongoose.Schema<IParentConsent>({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    consentType: {
        type: String,
        enum: ['platform', 'project-specific', 'time-bound'],
        required: true,
        default: 'platform'
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'expired', 'revoked'],
        default: 'pending'
    },
    grantedDate: Date,
    expiryDate: Date,
    permissions: {
        canApplyProjects: { type: Boolean, default: false },
        canCommunicate: { type: Boolean, default: false },
        canSubmitWork: { type: Boolean, default: false },
        canReceiveCertificates: { type: Boolean, default: false }
    },
    projectApprovals: [{
        projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillSwapProject' },
        status: { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' },
        decisionDate: Date,
        notes: String
    }],
    activityLog: [{
        action: { type: String, required: true }, // e.g., 'SIGNED_INITIAL_CONSENT', 'APPROVED_PROJECT'
        timestamp: { type: Date, default: Date.now },
        ipAddress: String,
        details: mongoose.Schema.Types.Mixed
    }],
    emergencySettings: {
        pauseEnabled: { type: Boolean, default: false },
        pauseUntil: Date,
        alertPreferences: [String]
    }
}, {
    timestamps: true
});

export default mongoose.model<IParentConsent>('ParentConsent', ParentConsentSchema);
