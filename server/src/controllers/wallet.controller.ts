import { Request, Response } from 'express';
import User from '../models/User';
import Transaction from '../models/Transaction';
import Withdrawal from '../models/Withdrawal';
import Referral from '../models/Referral';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import { socketService } from '../services/socketService';

// ==========================================
// WALLET ENDPOINTS (User)
// ==========================================

export const getWalletDashboard = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        
        const user = await User.findById(userId).select('balance totalEarned referralCode kycStatus');
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Get recent 10 transactions
        const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 }).limit(10);
        
        // Get referrals count
        const referralCount = await Referral.countDocuments({ referrerId: userId });

        return res.json({
            balance: user.balance,
            totalEarned: user.totalEarned,
            kycStatus: user.kycStatus,
            referralCode: user.referralCode,
            referralCount,
            recentTransactions: transactions
        });
    } catch (error) {
        console.error('getWalletDashboard error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = 20;
        
        const transactions = await Transaction.find({ userId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
            
        return res.json(transactions);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

export const requestWithdrawal = async (req: AuthRequest, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user.id;
        const { amount, method, accountDetails } = req.body; // Amount in paise

        // Validate minimum 100 INR (10000 paise)
        if (amount < 10000) {
            throw new Error('Minimum withdrawal amount is 100 INR');
        }

        const user = await User.findById(userId).session(session);
        if (!user) throw new Error('User not found');

        // Verify balance
        if (user.balance < amount) {
            throw new Error('Insufficient balance');
        }

        // Verify KYC
        if (user.kycStatus !== 'verified') {
            throw new Error('KYC verification required for withdrawals');
        }

        // Deduct balance instantly
        user.balance -= amount;
        await user.save({ session });

        // Log Transaction (Debit)
        await Transaction.create([{
            userId,
            type: 'withdrawal',
            amount: -amount,
            balanceAfter: user.balance,
            description: `Withdrawal request via ${method}`
        }], { session });

        // Create Withdrawal Record
        const withdrawal = await Withdrawal.create([{
            userId,
            amount,
            method,
            accountDetails,
            status: 'pending'
        }], { session });

        await session.commitTransaction();
        session.endSession();

        // Notify Admins
        socketService.notifyAdmins('new_withdrawal_request', {
            withdrawalId: withdrawal[0]._id.toString(),
            amount,
            userEmail: user.email
        });

        // Notify User
        socketService.notifyUser(userId.toString(), 'balance_update', {
            action: 'debited',
            amount: amount,
            newBalance: user.balance,
            message: `Withdrawal request of ${amount/100} INR submitted`
        });

        return res.status(201).json({ message: 'Withdrawal requested successfully', withdrawal: withdrawal[0] });
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        console.error('requestWithdrawal error:', error);
        return res.status(400).json({ message: error.message || 'Server error' });
    }
};

export const getWithdrawals = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const withdrawals = await Withdrawal.find({ userId }).sort({ createdAt: -1 });
        return res.json(withdrawals);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// ==========================================
// KYC & REFERRALS
// ==========================================

export const submitKYC = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const { idType, idNumber, idDocumentUrl, selfieUrl } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.kycStatus === 'verified' || user.kycStatus === 'pending') {
            return res.status(400).json({ message: `KYC is already ${user.kycStatus}` });
        }

        user.kycData = { idType, idNumber, idDocumentUrl, selfieUrl };
        user.kycStatus = 'pending';
        await user.save();

        return res.json({ message: 'KYC submitted successfully', kycStatus: 'pending' });
    } catch (error) {
        console.error('submitKYC error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const getReferrals = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        
        const referrals = await Referral.find({ referrerId: userId })
            .populate('referredId', 'firstName lastName email totalEarned')
            .sort({ createdAt: -1 });

        return res.json(referrals);
    } catch (error) {
        console.error('getReferrals error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// ==========================================
// ADMIN ENDPOINTS (Wallet/Withdrawals)
// ==========================================

export const adminGetPendingWithdrawals = async (req: AuthRequest, res: Response) => {
    try {
        const withdrawals = await Withdrawal.find({ status: 'pending' })
            .populate('userId', 'email firstName lastName')
            .sort({ createdAt: 1 });
        return res.json(withdrawals);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

export const adminProcessWithdrawal = async (req: AuthRequest, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { withdrawalId } = req.params;
        const { status, notes } = req.body; // 'approved', 'rejected', 'paid'
        const adminId = req.user.id;

        if (!['approved', 'rejected', 'paid'].includes(status)) {
            throw new Error('Invalid status');
        }

        const withdrawal = await Withdrawal.findById(withdrawalId).session(session);
        if (!withdrawal) throw new Error('Withdrawal not found');
        if (withdrawal.status === 'paid' || withdrawal.status === 'rejected') {
            throw new Error(`Withdrawal is already ${withdrawal.status}`);
        }

        // MOCK RAZORPAY INTEGRATION (In production, hit Razorpay API here if status === 'approved')
        // const payoutResponse = await createRazorpayPayout(withdrawal.accountDetails, withdrawal.amount);

        withdrawal.status = status;
        withdrawal.notes = notes;
        withdrawal.processedAt = new Date();
        withdrawal.processedBy = new mongoose.Types.ObjectId(adminId);

        // If rejected, refund money to user
        if (status === 'rejected') {
            const user = await User.findById(withdrawal.userId).session(session);
            if (user) {
                user.balance += withdrawal.amount;
                await user.save({ session });

                await Transaction.create([{
                    userId: user._id,
                    type: 'refund',
                    amount: withdrawal.amount,
                    balanceAfter: user.balance,
                    description: `Refund for rejected withdrawal: ${notes || 'No reason provided'}`,
                    referenceId: withdrawal._id
                }], { session });

                socketService.notifyUser(user._id.toString(), 'balance_update', {
                    action: 'credited',
                    amount: withdrawal.amount,
                    newBalance: user.balance,
                    message: `Withdrawal rejected. ${withdrawal.amount/100} INR refunded to balance.`
                });
            }
        }

        await withdrawal.save({ session });
        await session.commitTransaction();
        session.endSession();

        if (status === 'paid') {
            socketService.notifyUser(withdrawal.userId.toString(), 'withdrawal_paid', {
                amount: withdrawal.amount,
                message: `Your withdrawal of ${withdrawal.amount/100} INR has been paid successfully.`
            });
        }

        return res.json({ message: `Withdrawal marked as ${status}`, withdrawal });
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        console.error('adminProcessWithdrawal error:', error);
        return res.status(400).json({ message: error.message || 'Server error' });
    }
};
