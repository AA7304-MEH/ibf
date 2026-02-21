// Gamification Engine - XP, Levels, Badges, Streaks
import User from '../models/User';
import Badge from '../models/Badge';
import UserBadge from '../models/UserBadge';
import LeaderboardEntry from '../models/LeaderboardEntry';

// XP rewards for different activities
const XP_REWARDS = {
    LESSON_COMPLETE: 25,
    MODULE_COMPLETE: 100,
    COURSE_COMPLETE: 500,
    DAILY_LOGIN: 10,
    STREAK_BONUS: 5, // Per day of streak
    TASK_COMPLETE: 15,
    INTERNSHIP_MILESTONE: 50,
    INTERNSHIP_COMPLETE: 200,
    BADGE_EARN: 25,
    CHALLENGE_COMPLETE: 75,
    HELP_PEER: 20,
    MENTOR_FEEDBACK: 30,
};

// Level thresholds
const calculateLevel = (xp: number): number => {
    // Each level requires 500 XP more than the previous
    // Level 1: 0-499, Level 2: 500-1499, Level 3: 1500-2999, etc.
    return Math.floor(Math.sqrt(xp / 250)) + 1;
};

const getLevelTitle = (level: number): string => {
    const titles: Record<number, string> = {
        1: 'Beginner',
        5: 'Apprentice',
        10: 'Rising Star',
        15: 'Skilled',
        20: 'Expert',
        30: 'Master',
        50: 'Grandmaster',
        75: 'Legend',
        100: 'Mythic',
    };

    let title = 'Beginner';
    for (const [lvl, t] of Object.entries(titles)) {
        if (level >= parseInt(lvl)) title = t;
    }
    return title;
};

export const GamificationEngine = {
    // Award XP to user
    async awardXP(userId: string, activity: keyof typeof XP_REWARDS, multiplier = 1): Promise<{
        xpAwarded: number;
        newXP: number;
        levelUp: boolean;
        newLevel: number;
        newTitle: string;
    }> {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        const baseXP = XP_REWARDS[activity];
        const xpAwarded = Math.round(baseXP * multiplier);

        const oldLevel = calculateLevel(user.xp || 0);
        const newXP = (user.xp || 0) + xpAwarded;
        const newLevel = calculateLevel(newXP);
        const levelUp = newLevel > oldLevel;

        await User.findByIdAndUpdate(userId, {
            xp: newXP,
            level: newLevel,
            title: getLevelTitle(newLevel),
        });

        // Update leaderboard
        await this.updateLeaderboard(userId, newXP, newLevel);

        // Check for level-based badges
        if (levelUp) {
            await this.checkLevelBadges(userId, newLevel);
        }

        return {
            xpAwarded,
            newXP,
            levelUp,
            newLevel,
            newTitle: getLevelTitle(newLevel),
        };
    },

    // Update daily streak
    async updateStreak(userId: string): Promise<{ streak: number; bonusXP: number }> {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        const today = new Date().toDateString();
        const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate).toDateString() : null;

        let newStreak = 1;
        let bonusXP = XP_REWARDS.DAILY_LOGIN;

        if (lastLogin) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastLogin === yesterday.toDateString()) {
                // Consecutive day - increase streak
                newStreak = (user.loginStreak || 0) + 1;
                bonusXP += newStreak * XP_REWARDS.STREAK_BONUS;
            } else if (lastLogin === today) {
                // Already logged in today
                return { streak: user.loginStreak || 1, bonusXP: 0 };
            }
            // Otherwise, streak resets to 1
        }

        await User.findByIdAndUpdate(userId, {
            loginStreak: newStreak,
            lastLoginDate: new Date(),
            $inc: { xp: bonusXP },
        });

        // Check streak badges
        await this.checkStreakBadges(userId, newStreak);

        return { streak: newStreak, bonusXP };
    },

    // Award badge to user
    async awardBadge(userId: string, badgeId: string): Promise<boolean> {
        try {
            // Check if already earned
            const existing = await UserBadge.findOne({ userId, badgeId });
            if (existing) return false;

            await UserBadge.create({ userId, badgeId });

            // Award XP for earning badge
            await this.awardXP(userId, 'BADGE_EARN');

            // Update badge count in leaderboard
            await LeaderboardEntry.findOneAndUpdate(
                { userId, scope: 'global' },
                { $inc: { badgeCount: 1 } },
                { upsert: true }
            );

            return true;
        } catch (error) {
            console.error('Error awarding badge:', error);
            return false;
        }
    },

    // Check and award level-based badges
    async checkLevelBadges(userId: string, level: number): Promise<void> {
        const levelBadges: Record<number, string> = {
            5: 'Apprentice Achievement',
            10: 'Rising Star',
            25: 'Quarter Century',
            50: 'Half Century',
            100: 'Centurion',
        };

        const badgeName = levelBadges[level];
        if (badgeName) {
            const badge = await Badge.findOne({ name: badgeName });
            if (badge) {
                await this.awardBadge(userId, badge._id.toString());
            }
        }
    },

    // Check and award streak badges
    async checkStreakBadges(userId: string, streak: number): Promise<void> {
        const streakBadges: Record<number, string> = {
            7: 'Week Warrior',
            30: 'Month Master',
            100: 'Century Streak',
            365: 'Year of Dedication',
        };

        const badgeName = streakBadges[streak];
        if (badgeName) {
            const badge = await Badge.findOne({ name: badgeName });
            if (badge) {
                await this.awardBadge(userId, badge._id.toString());
            }
        }
    },

    // Update leaderboard entry
    async updateLeaderboard(userId: string, xp: number, level: number): Promise<void> {
        const user = await User.findById(userId);
        if (!user) return;

        await LeaderboardEntry.findOneAndUpdate(
            { userId, scope: 'global' },
            {
                xp,
                level,
                streak: user.loginStreak || 0,
            },
            { upsert: true }
        );
    },

    // Get leaderboard
    async getLeaderboard(scope: 'global' | 'school' | 'regional' = 'global', limit = 50, schoolId?: string): Promise<any[]> {
        const query: any = { scope };
        if (scope === 'school' && schoolId) query.schoolId = schoolId;

        const entries = await LeaderboardEntry.find(query)
            .sort({ xp: -1 })
            .limit(limit)
            .populate('userId', 'firstName lastName avatar');

        return entries.map((entry, index) => ({
            rank: index + 1,
            user: entry.userId,
            xp: entry.xp,
            level: entry.level,
            streak: entry.streak,
            badgeCount: entry.badgeCount,
        }));
    },

    // Get user stats
    async getUserStats(userId: string): Promise<any> {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        const badges = await UserBadge.find({ userId }).populate('badgeId');
        const leaderboardEntry = await LeaderboardEntry.findOne({ userId, scope: 'global' });

        return {
            xp: user.xp || 0,
            level: calculateLevel(user.xp || 0),
            title: getLevelTitle(calculateLevel(user.xp || 0)),
            streak: user.loginStreak || 0,
            badges: badges.map(ub => ub.badgeId),
            badgeCount: badges.length,
            globalRank: leaderboardEntry?.rank || 0,
            xpToNextLevel: ((calculateLevel(user.xp || 0) + 1) ** 2) * 250 - (user.xp || 0),
        };
    },
};

export default GamificationEngine;
