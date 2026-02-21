import { Request, Response } from 'express';
import { EquityCalculator } from '../services/symbiosis/EquityCalculator';
import { CultureCompatibilityEngine } from '../services/symbiosis/CultureMatcher';
import { ValuePredictor } from '../services/symbiosis/ValuePredictor';

const equityCalculator = new EquityCalculator();
const cultureMatcher = new CultureCompatibilityEngine();
const valuePredictor = new ValuePredictor();

export const calculateEquity = async (req: Request, res: Response) => {
    try {
        const { role, experience, riskProfile, location, companyStage } = req.body;
        // Mock company data if not provided
        const companyData = { stage: companyStage || 'seed', valuation: 5000000 };

        const result = equityCalculator.calculateEquityRange(role, experience, riskProfile, location, companyData);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: 'Equity calculation failed', error: error.message });
    }
};

export const calculateCultureMatch = async (req: Request, res: Response) => {
    try {
        const { userProfile, companyProfile } = req.body;
        // Mock if partial data
        const result = cultureMatcher.calculateCompatibility(userProfile || {}, companyProfile || {});
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: 'Culture matching failed', error: error.message });
    }
};

export const predictValue = async (req: Request, res: Response) => {
    try {
        const { userProfile, companyProfile, role } = req.body;
        const result = valuePredictor.predictLongTermValue(userProfile, companyProfile, role);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: 'Value prediction failed', error: error.message });
    }
};
