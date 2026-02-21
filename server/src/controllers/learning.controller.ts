import { Request, Response } from 'express';
import StudentProgress from '../models/StudentProgress';
import { AuthRequest } from '../middleware/auth';
import { FULL_STACK_PATH } from '../data/courseContent';

// Get Dashboard Data (Path + User Progress)
export const getMyLearningDashboard = async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user?.id;

        // 1. Fetch or Create Progress
        let progress = await StudentProgress.findOne({ studentId, learningPathId: 'full-stack-dev' });

        if (!progress) {
            progress = await StudentProgress.create({
                studentId,
                learningPathId: 'full-stack-dev',
                skillMetrics: {
                    frontend: 10, // Initial seed
                    backend: 5,
                    database: 0,
                    problemSolving: 50,
                    creativity: 50
                }
            });
        }

        // 2. Merge Static Path Data with User Progress
        // This creates the "Hydrated" learning path object for the frontend
        const hydratedModules = FULL_STACK_PATH.modules.map(module => {
            const userModule = progress?.progress.modules.find(m => m.moduleId === module.id);

            // Determine status
            let status = 'locked';
            if (module.id === 1) status = 'in-progress'; // First one always open
            if (userModule) {
                if (userModule.progress >= 100) status = 'completed';
                else status = 'in-progress';
            }
            // Unlock logic: if previous is completed, this is unlocked/in-progress
            // (Simplified for MVP: if index > 0 and prev is completed)
            // Ideally we check specific unlock conditions

            // Map Lessons
            const hydratedLessons = module.lessons.map(lesson => {
                const isCompleted = userModule?.completedLessons.includes(lesson.id) || false;
                return { ...lesson, completed: isCompleted };
            });

            return {
                ...module,
                status: userModule && userModule.progress >= 100 ? 'completed' : (status === 'locked' && userModule) ? 'in-progress' : status, // Fix status logic later if needed
                progress: userModule?.progress || 0,
                lessons: hydratedLessons
            };
        });

        // 3. Simple Unlock Logic Fix (If prev is done, next is unlocked)
        for (let i = 0; i < hydratedModules.length; i++) {
            if (i === 0) {
                if (hydratedModules[i].status === 'locked') hydratedModules[i].status = 'in-progress';
            } else {
                const prev = hydratedModules[i - 1];
                if (prev.status === 'completed' && hydratedModules[i].status === 'locked') {
                    hydratedModules[i].status = 'in-progress';
                }
            }
        }

        res.json({
            student: {
                name: req.user?.firstName || 'Student',
                xp: progress.progress.totalXP,
                streak: progress.progress.streak?.current || 0
            },
            learningPath: {
                ...FULL_STACK_PATH,
                modules: hydratedModules
            },
            skillDNA: progress.skillMetrics,
            recentAchievements: progress.achievements
        });

    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching LMS dashboard', error: error.message });
    }
};

// Get Lesson Details
export const getLessonDTO = async (req: AuthRequest, res: Response) => {
    try {
        const { moduleId, lessonId } = req.params;
        const modIdNum = parseInt(moduleId as string);
        const lessIdNum = parseInt(lessonId as string);

        const module = FULL_STACK_PATH.modules.find(m => m.id === modIdNum);
        const lesson = module?.lessons.find(l => l.id === lessIdNum);

        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

        res.json({
            ...lesson,
            moduleId: modIdNum,
            xp: 50 // Default XP per lesson if not in data
        });

    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching lesson', error: error.message });
    }
};

// Complete Lesson
export const completeLesson = async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user?.id;
        const { moduleId, lessonId, xpEarned } = req.body;
        const modIdNum = parseInt(moduleId as string);
        const lessIdNum = parseInt(lessonId as string);

        let progress = await StudentProgress.findOne({ studentId, learningPathId: 'full-stack-dev' });
        if (!progress) return res.status(404).json({ message: 'Progress record not found' });

        // Find or Create Module Entry
        let moduleEntry = progress.progress.modules.find(m => m.moduleId === modIdNum);
        if (!moduleEntry) {
            moduleEntry = {
                moduleId: modIdNum,
                completedLessons: [],
                progress: 0,
                startedAt: new Date(),
                xpEarned: 0
            };
            progress.progress.modules.push(moduleEntry);
            // Re-fetch reference after push? No, strict reference in JS works differently with Mongoose arrays sometimes.
            // Safer to pull it from the array again or use index.
            moduleEntry = progress.progress.modules[progress.progress.modules.length - 1];
        }

        // Add Lesson if not done
        if (!moduleEntry.completedLessons.includes(lessIdNum)) {
            moduleEntry.completedLessons.push(lessIdNum);
            moduleEntry.xpEarned += (xpEarned || 50);
            progress.progress.totalXP += (xpEarned || 50);

            // Calc Module Progress
            const totalLessons = FULL_STACK_PATH.modules.find(m => m.id === modIdNum)?.lessons.length || 1;
            moduleEntry.progress = Math.round((moduleEntry.completedLessons.length / totalLessons) * 100);

            if (moduleEntry.progress >= 100) {
                moduleEntry.completedAt = new Date();
                // Bonus XP for module completion?
            }

            // Update Skill Metrics (Mock Logic)
            if (modIdNum <= 2) progress.skillMetrics.frontend += 2;
            if (modIdNum === 3) progress.skillMetrics.backend += 2;

            await progress.save();
        }

        res.json({ message: 'Lesson completed', progress });

    } catch (error: any) {
        res.status(500).json({ message: 'Error completing lesson', error: error.message });
    }
};
