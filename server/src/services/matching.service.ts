import { IUser } from '../models/User'; // Assuming we update User with SkillDNA interface or use a separate Profile model
import { ISkillSwapProject } from '../models/SkillSwapProject';
import { ILearningPath } from '../models/LearningPath';

interface MatchResult {
    score: number; // 0-100
    breakdown: {
        skillMatch: number;
        interestMatch: number;
        styleMatch: number;
        timeMatch: number;
    };
    category: 'Perfect Match' | 'Growth Opportunity' | 'Comfort Zone' | 'Stretch' | 'Low Match';
}

export const calculateMatchScore = (
    studentProfile: any, // Typings to be refined based on SkillDNA availability
    project: ISkillSwapProject
): MatchResult => {
    // Weights
    const WEIGHTS = {
        SKILLS: 0.40,
        STYLE: 0.25,
        INTEREST: 0.20,
        TIME: 0.15
    };

    // 1. Skill Match Calculation
    let skillScore = 0;
    if (project.skillsRequired && project.skillsRequired.length > 0) {
        let skillsMet = 0;

        // Normalize student skills to array of objects { name, level }
        const studentSkills = (studentProfile.skills || []).map((s: any) => {
            if (typeof s === 'string') return { name: s, level: 'intermediate' }; // Default if string
            return s;
        });

        project.skillsRequired.forEach((req: any) => {
            // Normalize req skill
            const reqName = typeof req === 'string' ? req : req.name;
            const reqLevel = typeof req === 'string' ? 'beginner' : req.level;

            const studentSkill = studentSkills.find((s: any) => s.name.toLowerCase() === reqName.toLowerCase());

            if (studentSkill) {
                // Simple level checking
                const levels = ['beginner', 'intermediate', 'advanced'];
                const studLevelIdx = levels.indexOf(studentSkill.level || 'intermediate');
                const reqLevelIdx = levels.indexOf(reqLevel);

                if (studLevelIdx >= reqLevelIdx) {
                    skillsMet += 1; // Full match
                } else if (studLevelIdx === reqLevelIdx - 1) {
                    skillsMet += 0.5; // Partial match (Stretch)
                }
            }
        });

        skillScore = (skillsMet / project.skillsRequired.length) * 100;
    } else {
        skillScore = 100; // No skills required? Beginner friendly.
    }

    // 2. Interest Match
    let interestScore = 0;
    // Mock logic: Check if project category/tags overlap with student interests
    // Assuming project has 'learningObjectives' or implied category from title/desc
    // For MVP, lets assume we pass an interest array or check strings
    const studentInterests = studentProfile.interests || [];
    const projectTags = [project.title, ...project.learningObjectives].join(' ').toLowerCase();

    let interestHits = 0;
    studentInterests.forEach((interest: string) => {
        if (projectTags.includes(interest.toLowerCase())) interestHits++;
    });
    interestScore = Math.min((interestHits / Math.max(studentInterests.length, 1)) * 100, 100);
    // Boost if score is low but matches explicit "skillsToLearn"
    const skillLearnHits = project.skillsToLearn.filter(s => studentInterests.includes(s)).length;
    if (skillLearnHits > 0) interestScore = Math.max(interestScore, 80);


    // 3. Learning Style Match
    let styleScore = 50; // Neutral default
    // If student has a preferred style (e.g. Visual) and project tags it
    if (studentProfile.learningStyle && project.learningStyleTags.includes(studentProfile.learningStyle as any)) {
        styleScore = 100;
    }

    // 4. Time Availability Match
    let timeScore = 100;
    // If student has explicit availability constraints (e.g. max 5 hours) and project is 10 hours
    // This requires detailed availability data. For now, we assume if unspecified, it fits.

    // Final Weighted Score
    const totalScore = (
        (skillScore * WEIGHTS.SKILLS) +
        (styleScore * WEIGHTS.STYLE) +
        (interestScore * WEIGHTS.INTEREST) +
        (timeScore * WEIGHTS.TIME)
    );

    // Categorization
    let category: MatchResult['category'] = 'Low Match';
    if (totalScore >= 85) category = 'Perfect Match';
    else if (totalScore >= 70) category = 'Growth Opportunity'; // Good fit but maybe some stretch
    else if (skillScore > 90 && totalScore < 70) category = 'Comfort Zone'; // High skill match but low interest?
    else if (skillScore < 50 && totalScore > 40) category = 'Stretch'; // Low skill match but high interest

    return {
        score: Math.round(totalScore),
        breakdown: {
            skillMatch: Math.round(skillScore),
            interestMatch: Math.round(interestScore),
            styleMatch: Math.round(styleScore),
            timeMatch: Math.round(timeScore)
        },
        category
    };
};
