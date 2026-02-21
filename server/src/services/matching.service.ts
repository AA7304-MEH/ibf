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

// ==========================================
// COLLAB TALENT MATCHING
// ==========================================

interface TalentMatchScore {
    userId: string;
    score: number;
    skillMatch: number;
    experienceMatch: number;
    rateMatch: number;
    highlights: string[];
}

/**
 * Match talents to a project based on skills, experience, and rate
 */
export const matchTalentsToProject = async (
    projectSkills: string[],
    experienceLevel: string,
    budgetRange: { min: number; max: number } | null,
    talents: any[]
): Promise<TalentMatchScore[]> => {
    const scores: TalentMatchScore[] = [];

    for (const talent of talents) {
        // Skill matching
        const talentSkills = (talent.skills || []).map((s: string) => s.toLowerCase());
        const requiredSkills = projectSkills.map(s => s.toLowerCase());
        let matchedSkills = 0;

        for (const skill of requiredSkills) {
            if (talentSkills.includes(skill)) {
                matchedSkills++;
            } else if (talentSkills.some((ts: string) => ts.includes(skill) || skill.includes(ts))) {
                matchedSkills += 0.7;
            }
        }
        const skillMatch = requiredSkills.length > 0 ? (matchedSkills / requiredSkills.length) * 100 : 100;

        // Experience matching
        const levels = ['beginner', 'intermediate', 'expert'];
        const requiredIdx = levels.indexOf(experienceLevel?.toLowerCase() || 'intermediate');
        const talentIdx = levels.indexOf(talent.experienceLevel?.toLowerCase() || 'intermediate');
        const experienceMatch = talentIdx >= requiredIdx ? 100 : talentIdx === requiredIdx - 1 ? 70 : 40;

        // Rate matching
        let rateMatch = 80;
        if (budgetRange && talent.hourlyRate) {
            if (talent.hourlyRate <= budgetRange.min) rateMatch = 100;
            else if (talent.hourlyRate <= budgetRange.max) rateMatch = 90;
            else if (talent.hourlyRate <= budgetRange.max * 1.2) rateMatch = 60;
            else rateMatch = 30;
        }

        // Composite score
        const totalScore = (skillMatch * 0.5) + (experienceMatch * 0.3) + (rateMatch * 0.2);

        // Highlights
        const highlights: string[] = [];
        if (skillMatch > 80) highlights.push('Strong skill match');
        if (experienceMatch === 100) highlights.push('Perfect experience level');
        if (rateMatch > 80) highlights.push('Within budget');
        if (talent.successRate > 90) highlights.push('Top performer');

        scores.push({
            userId: talent.userId || talent._id?.toString(),
            score: Math.round(totalScore),
            skillMatch: Math.round(skillMatch),
            experienceMatch: Math.round(experienceMatch),
            rateMatch: Math.round(rateMatch),
            highlights
        });
    }

    return scores.sort((a, b) => b.score - a.score);
};

/**
 * Get recommended projects for a talent based on their profile
 */
export const getProjectRecommendations = (
    talentSkills: string[],
    talentRate: number,
    projects: any[]
): { projectId: string; score: number; reasons: string[] }[] => {
    const recommendations: { projectId: string; score: number; reasons: string[] }[] = [];

    for (const project of projects) {
        const projectSkills = (project.skillsRequired || []).map((s: string) => s.toLowerCase());
        const normalizedTalentSkills = talentSkills.map(s => s.toLowerCase());

        let matchedCount = 0;
        for (const skill of projectSkills) {
            if (normalizedTalentSkills.includes(skill)) matchedCount++;
        }
        const skillScore = projectSkills.length > 0 ? (matchedCount / projectSkills.length) * 100 : 50;

        let rateScore = 80;
        if (project.collabDetails?.budgetRange) {
            const { min, max } = project.collabDetails.budgetRange;
            if (talentRate >= min && talentRate <= max) rateScore = 100;
            else if (talentRate < min) rateScore = 90;
            else rateScore = 50;
        }

        const totalScore = (skillScore * 0.7) + (rateScore * 0.3);
        const reasons: string[] = [];

        if (skillScore > 70) reasons.push(`Matches ${matchedCount}/${projectSkills.length} skills`);
        if (rateScore > 80) reasons.push('Good budget fit');

        recommendations.push({
            projectId: project._id?.toString() || project.id,
            score: Math.round(totalScore),
            reasons
        });
    }

    return recommendations.sort((a, b) => b.score - a.score);
};
