const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['general', 'skillswap'],
        default: 'general',
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    skillsRequired: {
        type: [String],
        default: [],
    },
    projectType: {
        type: String,
        enum: ['general', 'skillswap'],
        required: true,
    },
    duration: {
        type: String, // e.g., "2-4 weeks"
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open',
    },
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
