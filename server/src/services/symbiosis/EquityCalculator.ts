export class EquityCalculator {
    private equityMatrix = {
        // Role Impact Multipliers
        roleImpact: {
            foundingEngineer: { min: 1.0, max: 2.5, weight: 0.3 },
            leadEngineer: { min: 0.8, max: 2.0, weight: 0.25 },
            seniorEngineer: { min: 0.5, max: 1.5, weight: 0.2 },
            engineer: { min: 0.2, max: 1.0, weight: 0.15 }
        },

        // Risk Profile Adjustments
        riskProfile: {
            preSeed: { multiplier: 1.5, cliff: 12, vesting: 48 },
            seed: { multiplier: 1.2, cliff: 12, vesting: 48 },
            seriesA: { multiplier: 1.0, cliff: 12, vesting: 48 },
            seriesB: { multiplier: 0.8, cliff: 12, vesting: 36 }
        },

        // Company Stage Adjustments
        companyStage: {
            idea: { equityPool: 15, dilution: 0.3 },
            prototype: { equityPool: 12, dilution: 0.25 },
            revenue: { equityPool: 10, dilution: 0.2 },
            scaling: { equityPool: 8, dilution: 0.15 }
        },

        // Market Rate Adjustments
        marketData: {
            siliconValley: { base: 1.2 },
            newYork: { base: 1.1 },
            london: { base: 1.0 },
            bangalore: { base: 0.8 },
            remote: { base: 1.0 }
        }
    };

    calculateEquityRange(role: string, experience: number, risk: string, location: string, companyData: any) {
        // Base equity from role
        const roleBase = this.equityMatrix.roleImpact[role as keyof typeof this.equityMatrix.roleImpact] || this.equityMatrix.roleImpact.engineer;
        const baseEquity = roleBase.min + (Math.min(experience, 10) / 10) * (roleBase.max - roleBase.min);

        // Risk adjustment
        const riskProfile = this.equityMatrix.riskProfile[risk as keyof typeof this.equityMatrix.riskProfile] || this.equityMatrix.riskProfile.seed;
        const riskMultiplier = riskProfile.multiplier;
        const adjustedEquity = baseEquity * riskMultiplier;

        // Location adjustment
        const locationMultiplier = this.equityMatrix.marketData[location as keyof typeof this.equityMatrix.marketData]?.base || 1.0;
        const locationAdjusted = adjustedEquity * locationMultiplier;

        // Company stage adjustment
        const companyStageData = this.equityMatrix.companyStage[companyData.stage as keyof typeof this.equityMatrix.companyStage] || this.equityMatrix.companyStage.revenue;
        // Normalize against pool (e.g., if pool is 10%, we adjust relatively, but here we treat it as a multiplier for simplicity or cap)
        // Original logic: stageAdjusted = locationAdjusted * (companyStageData.equityPool / 10);
        // Let's keep the logic as requested:
        const stageAdjusted = locationAdjusted * (companyStageData.equityPool / 10);

        // Final range calculation
        const minEquity = stageAdjusted * 0.8;
        const maxEquity = stageAdjusted * 1.2;

        return {
            range: {
                min: parseFloat(minEquity.toFixed(2)),
                max: parseFloat(maxEquity.toFixed(2)),
                recommended: parseFloat(((minEquity + maxEquity) / 2).toFixed(2))
            },
            vesting: {
                years: 4,
                cliffMonths: riskProfile.cliff,
                schedule: this.generateVestingSchedule(stageAdjusted, 4, riskProfile.cliff)
            },
            dilutionProjection: this.calculateDilution(companyData, 4, companyStageData.dilution),
            breakdown: {
                roleBase: parseFloat(baseEquity.toFixed(2)),
                riskAdjustment: `${riskMultiplier}x`,
                locationAdjustment: `${locationMultiplier}x`,
                stageAdjustment: `${companyStageData.equityPool}% pool`
            }
        };
    }

    generateVestingSchedule(totalEquity: number, years: number, cliffMonths: number) {
        const monthlyVest = totalEquity / (years * 12);
        const schedule = [];

        for (let month = 1; month <= years * 12; month++) {
            schedule.push({
                month,
                vested: month >= cliffMonths ? monthlyVest * (month - cliffMonths + 1) : 0,
                cliffReached: month === cliffMonths
            });
        }

        return schedule;
    }

    calculateDilution(companyData: any, years: number, annualDilutionRate: number) {
        const projection = [];
        let currentEquity = 100; // Starting relative percentage

        for (let i = 1; i <= years; i++) {
            currentEquity = currentEquity * (1 - annualDilutionRate);
            projection.push({
                year: i,
                dilutionCheck: parseFloat(currentEquity.toFixed(2))
            });
        }
        return projection;
    }
}
