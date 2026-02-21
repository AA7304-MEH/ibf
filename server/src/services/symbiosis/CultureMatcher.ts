export class CultureCompatibilityEngine {
    private cultureDimensions = {
        speedVsQuality: {
            axis: ['Speed', 'Quality'],
            weight: 0.15
        },
        autonomyVsStructure: {
            axis: ['Autonomy', 'Structure'],
            weight: 0.15
        },
        innovationVsStability: {
            axis: ['Innovation', 'Stability'],
            weight: 0.12
        },
        collaborationVsOwnership: {
            axis: ['Collaboration', 'Ownership'],
            weight: 0.12
        },
        feedbackStyle: {
            axis: ['Direct', 'Constructive'],
            weight: 0.10
        },
        workStyle: {
            axis: ['Async', 'Synchronous'],
            weight: 0.10
        },
        values: {
            axis: ['Mission', 'Growth'], // Simplified for vector math
            weight: 0.13,
            multiSelect: true
        }
    };

    calculateCompatibility(userProfile: any, companyProfile: any) {
        const dimensionScores: any = {};
        let totalWeight = 0;

        // Calculate each dimension
        for (const [dimension, config] of Object.entries(this.cultureDimensions)) {
            const userValue = userProfile[dimension] || 50; // Default 50 (middle)
            const companyValue = companyProfile[dimension] || 50;

            const score = this.calculateDimensionScore(userValue, companyValue, config);

            dimensionScores[dimension] = {
                score,
                weight: config.weight,
                match: this.getMatchLevel(score),
                explanation: this.generateExplanation(dimension, userValue, companyValue)
            };

            totalWeight += config.weight;
        }

        // Calculate overall compatibility
        const overallScore = Object.values(dimensionScores).reduce(
            (total: number, dim: any) => total + (dim.score * dim.weight),
            0
        ) as number / totalWeight;

        return {
            overallScore: parseFloat(overallScore.toFixed(2)),
            overallMatch: this.getMatchLevel(overallScore),
            dimensionScores,
            strengths: this.identifyStrengths(dimensionScores),
            gaps: this.identifyGaps(dimensionScores),
            recommendations: this.generateRecommendations(dimensionScores)
        };
    }

    private calculateDimensionScore(userValue: any, companyValue: any, config: any) {
        if (config.multiSelect) {
            // Simplified set overlap logic for array values
            if (Array.isArray(userValue) && Array.isArray(companyValue)) {
                const intersection = userValue.filter(x => companyValue.includes(x));
                const union = new Set([...userValue, ...companyValue]);
                return union.size === 0 ? 1 : intersection.length / union.size;
            }
            return 0.5;
        } else {
            // Normalized distance (0-100 scale)
            // 1 - delta/100
            return 1 - Math.abs(userValue - companyValue) / 100;
        }
    }

    private getMatchLevel(score: number) {
        if (score >= 0.8) return 'High';
        if (score >= 0.6) return 'Medium';
        return 'Low';
    }

    private generateExplanation(dimension: string, userValue: any, companyValue: any) {
        // Simple template logic
        const diff = userValue - companyValue;
        if (Math.abs(diff) < 20) return `Perfect alignment on ${dimension}.`;
        if (diff > 0) return `You prefer more ${this.cultureDimensions[dimension as keyof typeof this.cultureDimensions].axis[1]} than the company.`;
        return `You prefer more ${this.cultureDimensions[dimension as keyof typeof this.cultureDimensions].axis[0]} than the company.`;
    }

    private identifyStrengths(scores: any) {
        return Object.entries(scores)
            .filter(([, val]: [string, any]) => val.score > 0.8)
            .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim()); // Human readable
    }

    private identifyGaps(scores: any) {
        return Object.entries(scores)
            .filter(([, val]: [string, any]) => val.score < 0.6)
            .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim());
    }

    private generateRecommendations(scores: any) {
        const recommendations = [];
        const gaps = this.identifyGaps(scores);
        if (gaps.length > 0) {
            recommendations.push(`Discuss expectations regarding ${gaps.join(', ')} during the interview.`);
        }
        return recommendations;
    }
}
