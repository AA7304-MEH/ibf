import User, { IUser } from '../models/User';
import Internship, { IInternship as IMicroInternship } from '../models/Internship';

export class SymbiosisService {

    // AI Matching Algorithm
    async calculateMatch(studentId: string, internshipId: string): Promise<number> {
        try {
            const student = await User.findById(studentId);
            const internship = await Internship.findById(internshipId);

            if (!student || !internship) return 0;

            let totalScore = 0;
            let maxScore = 0;

            // 1. Skill Overlap (Weighted 50%)
            const internshipSkills = internship.skillsRequired || [];
            if (internshipSkills.length > 0) {
                const studentSkills = student.skills || [];

                let skillScore = 0;
                let maxSkillScore = internshipSkills.reduce((acc, s) => acc + (s.weight || 5), 0);

                internshipSkills.forEach(reqSkill => {
                    const match = studentSkills.find(s => s.name.toLowerCase() === reqSkill.name.toLowerCase());
                    if (match) {
                        // Base score for having the skill
                        let matchVal = reqSkill.weight || 5;

                        // Bonus for level match or exceed
                        const levels = ['beginner', 'intermediate', 'advanced'];
                        const studLevelIdx = levels.indexOf(match.level);
                        const reqLevelIdx = levels.indexOf(reqSkill.level);

                        if (studLevelIdx >= reqLevelIdx) {
                            matchVal *= 1.2; // 20% bonus for mastery
                        } else {
                            matchVal *= 0.5; // Penalty for under-qualified
                        }

                        skillScore += matchVal;
                    }
                });

                // Normalize to 50 points max
                const skillPercentage = maxSkillScore > 0 ? (skillScore / maxSkillScore) : 0;
                totalScore += skillPercentage * 50;
                maxScore += 50;
            }

            // 2. Interest Alignment (Weighted 30%)
            const studentInterests = student.interests || [];
            const category = internship.category;

            // Check category match
            const categoryMatch = studentInterests.some(i => i.toLowerCase().includes(category.toLowerCase()));
            if (categoryMatch) {
                totalScore += 30;
            }
            maxScore += 30;

            // 3. Availability / Duration Fit (Weighted 20%)
            // Placeholder: Assume good fit if not specified logic yet
            totalScore += 20;
            maxScore += 20;

            return Math.min(Math.round(totalScore), 100);

        } catch (error) {
            console.error('Symbiosis Match Error:', error);
            return 0;
        }
    }

    async findMatchesForStudent(studentId: string, limit = 5) {
        // Find all open internships
        const internships = await Internship.find({ status: 'open' });

        const scored = await Promise.all(internships.map(async (gig: IMicroInternship) => {
            const score = await this.calculateMatch(studentId, (gig._id as any).toString());
            return {
                gig,
                score
            };
        }));

        // Sort by score descending and return top N
        return scored
            .filter(match => match.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }
}

export const symbiosisService = new SymbiosisService();
