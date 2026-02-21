export class ValuePredictor {

    // Growth Models
    private exponential = (base: number, rate: number, years: number) => base * Math.pow(1 + rate, years);
    private logarithmic = (base: number, rate: number, years: number) => base * Math.log(1 + rate * years);
    private linear = (base: number, rate: number, years: number) => base * (1 + rate * years);

    predictLongTermValue(userProfile: any, companyProfile: any, roleDetails: any) {
        // 1. Calculate Individual Growth Score
        const individualGrowth = this.calculateIndividualGrowth(userProfile, companyProfile);

        // 2. Company Success Probability (Mock Logic)
        const companySuccess = { score: companyProfile.successProbability || 75 }; // Default 75/100

        // 3. Synergy Score
        const synergy = 0.85; // Mock synergy from Culture engine (could inject here)

        // 4. Predict 5-Year Outcomes
        const trajectory = this.projectGrowthTrajectory(individualGrowth.score, 5);

        return {
            overallPotential: parseFloat(((individualGrowth.score * 0.6 + companySuccess.score * 0.4) * synergy).toFixed(2)),
            individualGrowth,
            companySuccess,
            synergyScore: synergy,
            predictions: {
                bestCase: {
                    description: "High acceleration path. Company exits >$1B.",
                    equityValue: 500000 * 5, // Mock
                    careerLevel: "VP / C-Level"
                },
                expected: {
                    description: "Steady growth path. Company raises Series B/C.",
                    equityValue: 500000,
                    careerLevel: "Director / Staff Engineer"
                },
                conservative: {
                    description: "Slower growth. Company remains stable/profitable.",
                    equityValue: 100000,
                    careerLevel: "Senior / Lead"
                }
            },
            growthTrajectory: trajectory,
            riskFactors: [
                { category: "Market Risk", level: "Medium", description: "Sector is crowded.", mitigations: ["Focus on niche features."] },
                { category: "Burn Rate", level: "Low", description: "Company has 18m runway.", mitigations: ["Monitor quarterly reports."] }
            ],
            recommendations: {
                summary: "Strong match with high upside potential.",
                advantages: ["Great mentorship", "High equity upside"],
                considerations: ["Lower base salary than market avg"]
            }
        };
    }

    private calculateIndividualGrowth(user: any, company: any) {
        // Mock scoring based on profile overlap
        const score = 85;
        return {
            score,
            breakdown: { skillDev: 80, careerPath: 90 },
            growthTrajectory: this.projectGrowthTrajectory(score, 5)
        };
    }

    private projectGrowthTrajectory(currentScore: number, years: number) {
        const trajectory = [];
        for (let year = 1; year <= years; year++) {
            let projectedScore;
            if (currentScore < 50) projectedScore = this.exponential(currentScore, 0.15, year);
            else if (currentScore < 80) projectedScore = this.linear(currentScore, 0.08, year);
            else projectedScore = this.logarithmic(currentScore, 0.4, year); // Adjusted log base

            trajectory.push({
                year,
                score: Math.min(100, parseFloat(projectedScore.toFixed(1))),
                milestones: this.generateYearMilestones(year)
            });
        }
        return trajectory;
    }

    private generateYearMilestones(year: number) {
        const milestones: any = {
            1: ['Complete onboarding', 'First contribution'],
            2: ['Take ownership', 'Mentor junior'],
            3: ['Architectural decisions', 'Tech lead'],
            4: ['Strategic impact', 'External reputation'],
            5: ['Industry recognition', 'Executive potential']
        };
        return milestones[year] || [];
    }
}
