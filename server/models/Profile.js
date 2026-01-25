const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    // Common Fields
    fullName: String,
    bio: String,
    skills: [String], // e.g., ['React', 'UI/UX', 'Marketing']
    avatarUrl: String,

    // For Founder & their Startup (Merged from Startup model)
    startupName: String,
    startupPitch: String,
    startupStage: {
        type: String,
        enum: ['Idea', 'Prototype', 'Launch', 'Revenue', null],
        default: null
    },
    startupWebsite: String,
    incubatorStatus: {
        type: String,
        enum: ['none', 'applied', 'accepted', 'rejected'],
        default: 'none'
    },

    // For Student (SkillSwap)
    age: Number,
    school: String,
    parentalConsentVerified: { type: Boolean, default: false },

    // Portfolio & Trust
    portfolioLinks: [{
        title: String,
        url: String
    }],
    endorsements: [{
        fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        skill: String,
        comment: String
    }],
    matchPreferences: {
        desiredRoles: [String],
        availability: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
