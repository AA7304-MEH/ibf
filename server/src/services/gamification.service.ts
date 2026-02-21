import User from '../models/User';

export class GamificationService {
    private xpMultipliers = {
        login: 10,
        complete_project: 100,
        earn_badge: 50,
        peer_review: 25
    };

    private levels = [
        { level: 1, xp: 0, title: 'Novice' },
        { level: 2, xp: 100, title: 'Beginner' },
        { level: 3, xp: 300, title: 'Learner' },
        { level: 4, xp: 600, title: 'Practitioner' },
        { level: 5, xp: 1000, title: 'Specialist' },
        { level: 6, xp: 1500, title: 'Expert' },
        { level: 7, xp: 2100, title: 'Master' },
        { level: 8, xp: 2800, title: 'Grand Master' }
    ];

    async awardXP(userId: string, action: keyof typeof this.xpMultipliers) {
        try {
            const xp = this.xpMultipliers[action] || 10;
            const user = await User.findById(userId);
            if (!user) return;

            user.xp = (user.xp || 0) + xp;

            // Level Up Check
            const currentLevel = user.level || 1;
            const nextLevelDef = this.levels.find(l => l.level === currentLevel + 1);

            let newLevel = currentLevel;
            if (nextLevelDef && user.xp >= nextLevelDef.xp) {
                newLevel = nextLevelDef.level;
                user.level = newLevel;
                // Could emit event or notify user here
            }

            await user.save();
            return { xpAwarded: xp, newLevel, totalXP: user.xp };
        } catch (error) {
            console.error('Error awarding XP:', error);
            throw error;
        }
    }

    async checkStreak(userId: string) {
        const user = await User.findById(userId);
        if (!user) return;

        const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : new Date(0);
        const now = new Date();

        // Reset time component for comparison
        const lastDate = new Date(lastLogin.toDateString());
        const today = new Date(now.toDateString());

        const diffTime = Math.abs(today.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Consecutive day
            user.loginStreak = (user.loginStreak || 0) + 1;
            await this.awardXP(userId, 'login'); // Bonus XP for streak?
        } else if (diffDays > 1) {
            // Streak broken
            user.loginStreak = 1;
            await this.awardXP(userId, 'login');
        } else {
            // Same day login, no change
        }

        user.lastLoginDate = now;
        await user.save();
        return user.loginStreak;
    }
}

export const gamificationService = new GamificationService();
