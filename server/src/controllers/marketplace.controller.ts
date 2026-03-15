import { Request, Response } from 'express';
import Task from '../models/Task';
import TaskAttempt from '../models/TaskAttempt';
import Transaction from '../models/Transaction';
import User from '../models/User';
import Referral from '../models/Referral';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import { socketService } from '../services/socketService';

// ==========================================
// USER ENDPOINTS (Marketplace)
// ==========================================

export const getTasksByModule = async (req: AuthRequest, res: Response) => {
    try {
        const { module } = req.params;
        
        // Ensure valid module
        if (!['incubator', 'collab', 'skillswap'].includes(module as string)) {
            return res.status(400).json({ message: 'Invalid module specified' });
        }

        // Return active tasks with remaining quantity
        const tasks = await Task.find({ 
            module, 
            status: 'active',
            remainingQuantity: { $gt: 0 }
        }).sort({ createdAt: -1 });

        return res.json(tasks);
    } catch (error) {
        console.error('getTasksByModule error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const getTaskDetails = async (req: AuthRequest, res: Response) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId);
        
        if (!task) return res.status(404).json({ message: 'Task not found' });
        
        return res.json(task);
    } catch (error) {
        console.error('getTaskDetails error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const startTask = async (req: AuthRequest, res: Response) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        if (task.status !== 'active' || task.remainingQuantity <= 0) {
            return res.status(400).json({ message: 'Task is no longer available' });
        }

        // Check if user already attempted or started
        const existingAttempt = await TaskAttempt.findOne({ userId, taskId });
        if (existingAttempt) {
            return res.status(400).json({ 
                message: 'You have already attempted this task',
                attemptId: existingAttempt._id
            });
        }

        return res.status(200).json({ message: 'Task reserved successfully', task });
    } catch (error) {
        console.error('startTask error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const submitTask = async (req: AuthRequest, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { taskId } = req.params;
        const userId = req.user.id;
        const { answers, proofUrl } = req.body;

        const task = await Task.findById(taskId).session(session);
        if (!task) throw new Error('Task not found');
        if (task.remainingQuantity <= 0) throw new Error('Task quota reached');

        const existingAttempt = await TaskAttempt.findOne({ userId, taskId }).session(session);
        if (existingAttempt) throw new Error('Already submitted');

        // Decrement quantity
        task.remainingQuantity -= 1;
        if (task.remainingQuantity === 0) {
            task.status = 'completed';
        }
        await task.save({ session });

        // Auto-verify logic for simple tasks (captcha / exact match)
        let isApproved = false;
        if (task.verificationType === 'auto' && task.correctAnswer) {
            const submittedAnswer = typeof answers === 'string' ? answers : answers.answer;
            if (submittedAnswer && submittedAnswer.toLowerCase().trim() === task.correctAnswer.toLowerCase().trim()) {
                isApproved = true;
            } else {
                // Auto reject if wrong
                const attempt = await TaskAttempt.create([{
                    userId,
                    taskId,
                    answers,
                    proofUrl,
                    status: 'rejected',
                    reward: task.reward,
                    adminNotes: 'Auto-verification failed: incorrect answer'
                }], { session });

                await session.commitTransaction();
                session.endSession();
                return res.status(400).json({ message: 'Incorrect answer. Task rejected.', attempt: attempt[0] });
            }
        }

        // Create attempt
        const status = isApproved ? 'approved' : 'pending';
        const attempt = await TaskAttempt.create([{
            userId,
            taskId,
            answers,
            proofUrl,
            status,
            reward: task.reward,
            reviewedAt: isApproved ? new Date() : undefined
        }], { session });

        let finalBalance = 0;

        // If approved instantly, handle earnings
        if (isApproved) {
            const user = await User.findById(userId).session(session);
            if (!user) throw new Error('User not found');

            user.balance += task.reward;
            user.totalEarned += task.reward;
            finalBalance = user.balance;

            // Log Transaction
            await Transaction.create([{
                userId,
                type: 'earning',
                amount: task.reward,
                balanceAfter: user.balance,
                description: `Earned from task: ${task.title}`,
                referenceId: attempt[0]._id
            }], { session });

            // Handle Referral Bonus (5%)
            if (user.referredBy) {
                const bonus = Math.floor(task.reward * 0.05);
                if (bonus > 0) {
                    const referrer = await User.findById(user.referredBy).session(session);
                    if (referrer) {
                        referrer.balance += bonus;
                        referrer.totalEarned += bonus;
                        referrer.referralEarnings += bonus;
                        await referrer.save({ session });

                        await Transaction.create([{
                            userId: referrer._id,
                            type: 'referral_bonus',
                            amount: bonus,
                            balanceAfter: referrer.balance,
                            description: `Referral bonus from task completed by ${user.email}`,
                            referenceId: attempt[0]._id
                        }], { session });

                        await Referral.updateOne(
                            { referrerId: referrer._id, referredId: user._id },
                            { $inc: { earnings: bonus } },
                            { session }
                        );
                    }
                }
            }
            await user.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        // Socket Notification
        if (isApproved) {
            socketService.notifyUser(userId.toString(), 'balance_update', { 
                action: 'credited', 
                amount: task.reward, 
                newBalance: finalBalance,
                message: `Earned ${task.reward/100} INR from ${task.title}`
            });
        }

        return res.status(200).json({ 
            message: isApproved ? 'Task approved and reward credited!' : 'Task submitted for review',
            status,
            attempt: attempt[0]
        });

    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        console.error('submitTask error:', error);
        return res.status(400).json({ message: error.message || 'Server error' });
    }
};

// ==========================================
// ADMIN ENDPOINTS (Marketplace)
// ==========================================

export const adminCreateTask = async (req: AuthRequest, res: Response) => {
    try {
        const adminId = req.user.id;
        const taskData = { ...req.body, createdBy: adminId, remainingQuantity: req.body.totalQuantity };
        
        const task = await Task.create(taskData);
        return res.status(201).json({ message: 'Task created', task });
    } catch (error: any) {
        console.error('adminCreateTask error:', error);
        return res.status(400).json({ message: error.message || 'Error creating task' });
    }
};

export const adminGetTasks = async (req: AuthRequest, res: Response) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        return res.json(tasks);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

export const adminReviewTaskAttempt = async (req: AuthRequest, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { attemptId } = req.params;
        const { status, adminNotes } = req.body; // 'approved' or 'rejected'
        const adminId = req.user.id;

        if (!['approved', 'rejected'].includes(status)) {
            throw new Error('Invalid status');
        }

        const attempt = await TaskAttempt.findById(attemptId).session(session);
        if (!attempt) throw new Error('Attempt not found');
        if (attempt.status !== 'pending') throw new Error('Attempt is already processed');

        attempt.status = status;
        attempt.adminNotes = adminNotes;
        attempt.reviewedAt = new Date();
        attempt.reviewedBy = new mongoose.Types.ObjectId(adminId);

        let finalBalance = 0;

        if (status === 'approved') {
            const user = await User.findById(attempt.userId).session(session);
            if (!user) throw new Error('User not found');

            const task = await Task.findById(attempt.taskId).session(session);
            if (!task) throw new Error('Task not found');

            user.balance += attempt.reward;
            user.totalEarned += attempt.reward;
            finalBalance = user.balance;

            // Log Transaction
            await Transaction.create([{
                userId: user._id,
                type: 'earning',
                amount: attempt.reward,
                balanceAfter: user.balance,
                description: `Earned from task: ${task.title} (Manual Review)`,
                referenceId: attempt._id
            }], { session });

            // Referral Bonus
            if (user.referredBy) {
                const bonus = Math.floor(attempt.reward * 0.05);
                if (bonus > 0) {
                    const referrer = await User.findById(user.referredBy).session(session);
                    if (referrer) {
                        referrer.balance += bonus;
                        referrer.totalEarned += bonus;
                        referrer.referralEarnings += bonus;
                        await referrer.save({ session });

                        await Transaction.create([{
                            userId: referrer._id,
                            type: 'referral_bonus',
                            amount: bonus,
                            balanceAfter: referrer.balance,
                            description: `Referral bonus from manual task approval for ${user.email}`,
                            referenceId: attempt._id
                        }], { session });

                        await Referral.updateOne(
                            { referrerId: referrer._id, referredId: user._id },
                            { $inc: { earnings: bonus } },
                            { session }
                        );
                    }
                }
            }
            await user.save({ session });
        }

        await attempt.save({ session });
        
        await session.commitTransaction();
        session.endSession();

        // Notify user
        socketService.notifyUser(attempt.userId.toString(), 'task_reviewed', {
            taskId: attempt.taskId,
            status,
            amount: attempt.reward
        });

        if (status === 'approved') {
            socketService.notifyUser(attempt.userId.toString(), 'balance_update', { 
                action: 'credited', 
                amount: attempt.reward, 
                newBalance: finalBalance
            });
        }

        return res.json({ message: `Attempt ${status}`, attempt });

    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        console.error('adminReviewTaskAttempt error:', error);
        return res.status(400).json({ message: error.message || 'Server error' });
    }
};
