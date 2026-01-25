import User from '../models/User';
import Achievement from '../models/Achievement';

export const awardXP = async (userId: string, amount: number, reason: string) => {
    try {
        const user: any = await User.findById(userId);
        if (!user) return;

        // Add XP (assuming we added an xp field to user, if not we'll just log it for now or rely on Achievements count)
        // ideally: user.xp += amount;
        // await user.save();

        console.log(`[GAMIFICATION] Awarded ${amount} XP to ${userId} for ${reason}`);
    } catch (err) {
        console.error(err);
    }
};

export const checkAchievements = async (userId: string, type: 'project_complete' | 'login_streak') => {
    // Mock logic: Award a badge on first project
    if (type === 'project_complete') {
        const exists = await Achievement.findOne({ userId, title: 'First Builder' });
        if (!exists) {
            await Achievement.create({
                userId,
                type: 'badge',
                title: 'First Builder',
                description: 'Completed your first SkillSwap project!',
                xpAwarded: 100,
                icon: 'Hammer'
            });
            return { newBadge: 'First Builder' };
        }
    }
    return null;
};
