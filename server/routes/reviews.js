const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Profile = require('../models/Profile');

/**
 * @route   POST api/reviews/:userId
 * @desc    Submit a review and rating for a user
 * @access  Private
 */
router.post('/:userId', auth, async (req, res) => {
    try {
        const { rating, comment, isEndorsement, skillTag } = req.body;
        const targetUserId = req.params.userId;

        if (req.user.id === targetUserId) {
            return res.status(400).json({ msg: 'You cannot review yourself' });
        }

        const targetUser = await User.findById(targetUserId);
        if (!targetUser) return res.status(404).json({ msg: 'User not found' });

        // Update target user's aggregate rating
        const currentTotalRating = targetUser.rating * targetUser.reviewCount;
        const newReviewCount = targetUser.reviewCount + 1;
        const newRating = (currentTotalRating + rating) / newReviewCount;

        targetUser.rating = newRating;
        targetUser.reviewCount = newReviewCount;
        await targetUser.save();

        // If it's an endorsement, add to profile
        if (isEndorsement && skillTag) {
            const profile = await Profile.findOne({ userId: targetUserId });
            if (profile) {
                profile.endorsements.push({
                    fromUserId: req.user.id,
                    skill: skillTag,
                    comment: comment
                });
                await profile.save();
            }
        }

        res.json({ msg: 'Review submitted successfully', newRating });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
