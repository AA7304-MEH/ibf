import User from '../models/User';
import Project from '../models/Project';
import Startup from '../models/Startup';
import Transaction from '../models/Transaction';
import { NeuralNetwork } from '../utils/NeuralNetwork';

export class EcosystemService {
    private brain: NeuralNetwork;

    constructor() {
        this.brain = new NeuralNetwork(3, 4, 2);
        this.trainBrain();
    }

    private trainBrain() {
        // Pattern: High Users + High Projects = High Opportunity
        const trainingSet = [
            { input: [0.1, 0.1, 0.1], output: [0.1, 0.9] },
            { input: [0.5, 0.5, 0.5], output: [0.5, 0.5] },
            { input: [0.9, 0.9, 0.9], output: [0.9, 0.1] }
        ];
        for (let i = 0; i < 2000; i++) {
            const data = trainingSet[Math.floor(Math.random() * trainingSet.length)];
            this.brain.train(data.input, data.output);
        }
    }

    async getGlobalStats() {
        try {
            // Parallelize independent queries for performance
            const [
                userCount,
                startupCount,
                projectCount,
                load
            ] = await Promise.all([
                User.countDocuments(),
                Startup.countDocuments(),
                Project.countDocuments(),
                this.getSystemLoad()
            ]);

            const [
                signals,
                zones,
                opportunities
            ] = await Promise.all([
                this.getSignals(),
                this.getActivityZones(),
                this.getAiOpportunities(userCount, projectCount, load.count) // Pass Real Counts to AI
            ]);

            return {
                nodes: userCount,
                livestream_rate: this.calculateLivestreamRate(projectCount),
                signals,
                opportunities,
                learning_velocity: "HIGH",
                activity_zones: zones,
                system_load: load
            };
        } catch (error) {
            console.error('Error fetching ecosystem stats:', error);
            throw error;
        }
    }

    private calculateLivestreamRate(projectCount: number): string {
        // Mock calculation based on real project count
        // E.g., 4.2TB/s base + projectCount * factor
        const base = 2.0;
        const variable = (projectCount / 100).toFixed(1);
        return `${(base + parseFloat(variable)).toFixed(1)}TB/s`;
    }

    private async getSignals() {
        // Aggregate top tags from recent projects
        const signals = await Project.aggregate([
            { $match: { status: { $in: ['open', 'in_progress'] } } },
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        return signals.map(s => ({
            name: s._id,
            strength: s.count,
            trend: '+' + Math.floor(Math.random() * 100) + '%' // Trend simulation
        }));
    }

    private async getAiOpportunities(users: number, projects: number, txns: number) {
        // 1. EXTRACT: Aggregate real data from Startups
        const industries = await Startup.aggregate([
            { $match: { industry: { $exists: true, $ne: '' } } },
            {
                $group: {
                    _id: '$industry',
                    count: { $sum: 1 },
                    avgGrowth: { $avg: '$metrics.growthRate' },
                    avgMarket: { $avg: '$marketSize' }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 3 }
        ]);

        // 2. PROCESS: Normalize inputs for Neural Network
        const normUsers = Math.min(users / 100, 1);
        const normProjects = Math.min(projects / 100, 1);
        const normTxns = Math.min(txns / 100, 1);

        // 3. PREDICT: Feed inputs to Brain
        // The Brain uses the "Training" (Activity Patterns) to predict outcomes
        const prediction = this.brain.predict([normUsers, normProjects, normTxns]);
        const oppScore = prediction[0]; // Opportunity Score
        const riskScore = prediction[1]; // Risk Score

        return industries.map(i => {
            // Combine Real Data + AI Prediction
            const baseGrowth = i.avgGrowth || 50;
            // AI modulates the growth forecast based on ecosystem activity
            const aiModulation = (oppScore - 0.5) * 20;
            const finalGrowth = Math.floor(baseGrowth + aiModulation);

            const marketFactor = (i.avgMarket || 50) / 100;
            const combinedRisk = (riskScore * 0.6) + ((1 - marketFactor) * 0.4);
            const riskLabel = combinedRisk > 0.6 ? 'High Risk' : (combinedRisk > 0.3 ? 'Med Risk' : 'Low Risk');

            return {
                sector: i._id,
                growth: finalGrowth + '%',
                risk: riskLabel,
                ai_confidence: (Math.max(oppScore, riskScore) * 100).toFixed(1) + '%'
            };
        });
    }

    private async getActivityZones() {
        // Aggregate users by role to simulate 'Activity Zones'
        const roles = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        // Map roles to heatmap zones
        const zoneMap: Record<string, number> = {};
        roles.forEach(r => {
            if (r._id) zoneMap[r._id] = r.count;
        });

        // Normalize to intensity 0-1
        const max = Math.max(...roles.map(r => r.count), 1);

        return [
            { id: 'ZONE_01', name: 'Incubator', intensity: (zoneMap['founder'] || 0) / max },
            { id: 'ZONE_02', name: 'SkillSwap', intensity: (zoneMap['student'] || 0) / max },
            { id: 'ZONE_03', name: 'Collab', intensity: (zoneMap['talent'] || 0) / max },
            { id: 'ZONE_04', name: 'Admin', intensity: (zoneMap['admin'] || 0) / max },
        ];
    }

    private async getSystemLoad() {
        // Count recent transactions
        const recentTxns = await Transaction.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });
        return {
            tps: (recentTxns / 86400).toFixed(4), // Transactions per second (avg over 24h)
            count: recentTxns
        };
    }
}

export const ecosystemService = new EcosystemService();
