import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

// Type definitions (Mock)
interface Question {
    id: number;
    text: string;
    options: string[];
    correctIndex?: number; // Simplified
}

const MOCK_QUESTIONS: Question[] = [
    {
        id: 1,
        text: "Which of the following is NOT a semantic HTML element?",
        options: ["<article>", "<div>", "<section>", "<aside>"],
        correctIndex: 1
    },
    {
        id: 2,
        text: "What does CSS property 'flex-direction: column' do?",
        options: ["Aligns items horizontally", "Aligns items vertically", "Reverses item order", "Wraps items to new line"],
        correctIndex: 1
    },
    {
        id: 3,
        text: "In JavaScript, which keyword declares a constant variable?",
        options: ["var", "let", "const", "static"],
        correctIndex: 2
    }
];

const SkillAssessmentWizard: React.FC = () => {
    const navigate = useNavigate();
    const [started, setStarted] = useState(false);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [completed, setCompleted] = useState(false);

    // Skill DNA Result State (Mock)
    const [skillDNA, setSkillDNA] = useState<any>(null);

    const handleStart = () => setStarted(true);

    const handleAnswer = (optionIndex: number) => {
        const newAnswers = [...answers, optionIndex];
        setAnswers(newAnswers);

        if (currentQIndex < MOCK_QUESTIONS.length - 1) {
            setTimeout(() => setCurrentQIndex(prev => prev + 1), 300);
        } else {
            finishAssessment(newAnswers);
        }
    };

    const finishAssessment = (finalAnswers: number[]) => {
        // Calculate score
        let correctCount = 0;
        finalAnswers.forEach((ans, idx) => {
            if (ans === MOCK_QUESTIONS[idx].correctIndex) correctCount++;
        });

        const score = (correctCount / MOCK_QUESTIONS.length) * 100;

        // Generate Mock DNA
        const dna = {
            score,
            level: score > 70 ? 'Intermediate' : 'Beginner',
            strongestSkill: 'HTML/CSS',
            recommendedPath: 'Frontend Developer Path'
        };

        setSkillDNA(dna);
        setCompleted(true);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <AnimatePresence mode="wait">
                    {!started ? (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700 text-center"
                        >
                            <div className="h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                                <span className="text-3xl">🧬</span>
                            </div>
                            <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                                Discover Your Skill DNA
                            </h1>
                            <p className="text-gray-400 mb-8 text-lg">
                                Take our adaptive diagnostic test to unlock your personalized learning roadmap.
                                We'll analyze your current skills and match you with the perfect projects.
                            </p>
                            <button
                                onClick={handleStart}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-600/30"
                            >
                                Start Assessment
                            </button>
                        </motion.div>
                    ) : !completed ? (
                        <motion.div
                            key="quiz"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-sm text-gray-400 uppercase tracking-wider">Question {currentQIndex + 1} of {MOCK_QUESTIONS.length}</span>
                                <div className="w-1/3 bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <motion.div
                                        className="bg-blue-500 h-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((currentQIndex) / MOCK_QUESTIONS.length) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <h2 className="text-2xl font-semibold mb-8">
                                {MOCK_QUESTIONS[currentQIndex].text}
                            </h2>

                            <div className="space-y-4">
                                {MOCK_QUESTIONS[currentQIndex].options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        className="w-full text-left p-4 rounded-xl bg-gray-700/50 hover:bg-blue-600/20 hover:border-blue-500 border border-transparent transition-all group flex items-center"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-gray-700 group-hover:bg-blue-500 flex items-center justify-center mr-4 text-sm font-bold transition-colors">
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className="text-lg">{opt}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700 text-center"
                        >
                            <CheckCircleIcon className="h-20 w-20 text-green-400 mx-auto mb-6" />
                            <h2 className="text-3xl font-bold mb-2">Analysis Complete!</h2>
                            <p className="text-gray-400 mb-8">Here is your initial Skill DNA profile:</p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-gray-700/50 p-4 rounded-xl">
                                    <div className="text-sm text-gray-400">Proficiency</div>
                                    <div className="text-2xl font-bold text-white">{skillDNA.level}</div>
                                </div>
                                <div className="bg-gray-700/50 p-4 rounded-xl">
                                    <div className="text-sm text-gray-400">Strongest Skill</div>
                                    <div className="text-2xl font-bold text-blue-400">{skillDNA.strongestSkill}</div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-6 rounded-xl border border-blue-500/30 mb-8">
                                <h3 className="text-lg font-semibold mb-2">Recommended Path</h3>
                                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                    {skillDNA.recommendedPath}
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/skillswap/dashboard')} // Assumption
                                className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-full font-bold text-lg flex items-center mx-auto transition-all"
                            >
                                Go to My Roadmap <ArrowRightIcon className="h-5 w-5 ml-2" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SkillAssessmentWizard;
