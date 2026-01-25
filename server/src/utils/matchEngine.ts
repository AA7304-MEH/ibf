interface MatchCriteria {
    skills: string[];
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    preferredProjectTypes: string[];
    availability: number; // hours per week
    pastProjects: string[];
}

interface ProjectRequirements {
    requiredSkills: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedHours: number;
    projectType: string;
}

export class MatchEngine {
    static calculateMatchScore(
        userCriteria: MatchCriteria,
        projectReqs: ProjectRequirements
    ): number {
        let score = 0;
        const maxScore = 100;

        // 1. Skill match (40% weight)
        const skillMatch = this.calculateSkillMatch(
            userCriteria.skills,
            projectReqs.requiredSkills
        );
        score += skillMatch * 0.4;

        // 2. Experience level match (30% weight)
        const experienceMatch = this.calculateExperienceMatch(
            userCriteria.experienceLevel,
            projectReqs.difficulty
        );
        score += experienceMatch * 0.3;

        // 3. Availability match (20% weight)
        const availabilityMatch = this.calculateAvailabilityMatch(
            userCriteria.availability,
            projectReqs.estimatedHours
        );
        score += availabilityMatch * 0.2;

        // 4. Project type preference (10% weight)
        const typeMatch = userCriteria.preferredProjectTypes.includes(projectReqs.projectType) ? 1 : 0;
        score += typeMatch * 0.1;

        return Math.round(score * maxScore);
    }

    private static calculateSkillMatch(userSkills: string[], requiredSkills: string[]): number {
        if (requiredSkills.length === 0) return 1;

        const matchedSkills = requiredSkills.filter(skill =>
            userSkills.some(userSkill =>
                userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(userSkill.toLowerCase())
            )
        );

        return matchedSkills.length / requiredSkills.length;
    }

    private static calculateExperienceMatch(userExp: string, projectDiff: string): number {
        const levels = { beginner: 1, intermediate: 2, advanced: 3 };
        const u = levels[userExp as keyof typeof levels] || 1;
        const p = levels[projectDiff as keyof typeof levels] || 1;

        if (u >= p) return 1;
        return u / p;
    }

    private static calculateAvailabilityMatch(userAvail: number, projectHours: number): number {
        // Rough heuristic: if user has enough hours for the project duration (simplified)
        // Assuming projectHours is total, and userAvail is weekly. 
        // This logic is a placeholder for more complex temporal matching.
        return 1;
    }
}
