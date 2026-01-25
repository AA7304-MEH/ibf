const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

// @route   POST api/messages
// @desc    Send a message
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { receiverId, projectId, content } = req.body;

        const newMessage = new Message({
            sender: req.user.id,
            receiver: receiverId,
            project: projectId,
            content,
        });

        const message = await newMessage.save();
        res.json(message);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/messages/conversations
// @desc    Get all conversations (grouped by project/user logic - simplified for MVP to just list messages)
// But for MVP: "See applications/messages for their projects" & "messaging system"
// Let's simplified: Get messages involved with current user.
router.get('/', auth, async (req, res) => {
    try {
        // Find messages where current user is sender OR receiver
        const messages = await Message.find({
            $or: [{ sender: req.user.id }, { receiver: req.user.id }]
        })
            .populate('sender', 'name')
            .populate('receiver', 'name')
            .populate('project', 'title')
            .sort({ createdAt: -1 });

        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
