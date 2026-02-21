import { Request, Response } from 'express';
import { GamificationEngine } from '../services/GamificationEngine';
import Badge from '../models/Badge';
import UserBadge from '../models/UserBadge';

export const gamificationController = {
    // Get user's gamification stats
    async getUserStats(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) return res.status(401).json({ message: 'Unauthorized' });

            const stats = await GamificationEngine.getUserStats(userId);
            res.json(stats);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get leaderboard
    async getLeaderboard(req: Request, res: Response) {
        try {
            const scope = (req.query.scope as 'global' | 'school' | 'regional') || 'global';
            const limit = parseInt(req.query.limit as string) || 50;
            const schoolId = req.query.schoolId as string;

            const leaderboard = await GamificationEngine.getLeaderboard(scope, limit, schoolId);
            res.json(leaderboard);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get all badges
    async getAllBadges(req: Request, res: Response) {
        try {
            const badges = await Badge.find().sort({ rarity: 1, name: 1 });
            res.json(badges);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get user's earned badges
    async getUserBadges(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) return res.status(401).json({ message: 'Unauthorized' });

            const userBadges = await UserBadge.find({ userId })
                .populate('badgeId')
                .sort({ earnedAt: -1 });

            res.json(userBadges.map(ub => ({
                ...((ub.badgeId as any)?.toObject?.() || ub.badgeId),
                earnedAt: ub.earnedAt,
                nftMinted: ub.nftMinted,
            })));
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    // Award XP (admin or system use)
    async awardXP(req: Request, res: Response) {
        try {
            const { userId, activity, multiplier } = req.body;

            const result = await GamificationEngine.awardXP(userId, activity, multiplier || 1);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    // Check-in (daily login)
    async dailyCheckIn(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) return res.status(401).json({ message: 'Unauthorized' });

            const result = await GamificationEngine.updateStreak(userId);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    // Create badge (admin only)
    async createBadge(req: Request, res: Response) {
        try {
            const badgeData = req.body;
            const badge = await Badge.create(badgeData);
            res.status(201).json(badge);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    // Seed default badges
    async seedBadges(req: Request, res: Response) {
        try {
            const defaultBadges = [
                // Level badges
                { name: 'Apprentice Achievement', description: 'Reached Level 5', icon: '🎓', category: 'milestone', criteria: 'Reach Level 5', rarity: 'common' },
                { name: 'Rising Star', description: 'Reached Level 10', icon: '⭐', category: 'milestone', criteria: 'Reach Level 10', rarity: 'uncommon' },
                { name: 'Quarter Century', description: 'Reached Level 25', icon: '🏅', category: 'milestone', criteria: 'Reach Level 25', rarity: 'rare' },
                { name: 'Half Century', description: 'Reached Level 50', icon: '🏆', category: 'milestone', criteria: 'Reach Level 50', rarity: 'epic' },
                { name: 'Centurion', description: 'Reached Level 100', icon: '👑', category: 'milestone', criteria: 'Reach Level 100', rarity: 'legendary' },

                // Streak badges
                { name: 'Week Warrior', description: '7-day login streak', icon: '🔥', category: 'achievement', criteria: '7 consecutive days', rarity: 'common' },
                { name: 'Month Master', description: '30-day login streak', icon: '💪', category: 'achievement', criteria: '30 consecutive days', rarity: 'rare' },
                { name: 'Century Streak', description: '100-day login streak', icon: '🌟', category: 'achievement', criteria: '100 consecutive days', rarity: 'epic' },
                { name: 'Year of Dedication', description: '365-day login streak', icon: '🎖️', category: 'achievement', criteria: '365 consecutive days', rarity: 'legendary' },

                // Skill badges
                { name: 'Code Ninja', description: 'Completed 10 coding challenges', icon: '🥷', category: 'skill', criteria: 'Complete 10 coding challenges', rarity: 'uncommon' },
                { name: 'Design Maestro', description: 'Completed 5 design projects', icon: '🎨', category: 'skill', criteria: 'Complete 5 design projects', rarity: 'uncommon' },
                { name: 'Data Wizard', description: 'Completed data analysis course', icon: '📊', category: 'skill', criteria: 'Complete data analysis course', rarity: 'rare' },
                { name: 'Full Stack Hero', description: 'Mastered frontend and backend', icon: '🦸', category: 'skill', criteria: 'Complete full stack path', rarity: 'epic' },

                // Internship badges
                { name: 'First Mission', description: 'Completed first micro-internship', icon: '🚀', category: 'achievement', criteria: 'Complete 1 micro-internship', rarity: 'common' },
                { name: 'Mission Expert', description: 'Completed 5 micro-internships', icon: '💼', category: 'achievement', criteria: 'Complete 5 micro-internships', rarity: 'rare' },
                { name: 'Industry Ready', description: 'Completed 10 micro-internships', icon: '🎯', category: 'achievement', criteria: 'Complete 10 micro-internships', rarity: 'epic' },

                // Social badges
                { name: 'Team Player', description: 'Helped 5 peers', icon: '🤝', category: 'achievement', criteria: 'Help 5 peers', rarity: 'common' },
                { name: 'Mentor\'s Favorite', description: 'Received 5-star mentor feedback', icon: '⭐', category: 'achievement', criteria: 'Get 5-star mentor review', rarity: 'uncommon' },
            ];

            for (const badge of defaultBadges) {
                await Badge.findOneAndUpdate(
                    { name: badge.name },
                    badge,
                    { upsert: true, new: true }
                );
            }

            res.json({ message: `Seeded ${defaultBadges.length} badges` });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },
};

export default gamificationController;
