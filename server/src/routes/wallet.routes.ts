import express from 'express';
import { protect, authorize } from '../middleware/auth';
import {
    getWalletDashboard,
    getTransactions,
    requestWithdrawal,
    getWithdrawals,
    submitKYC,
    getReferrals,
    adminGetPendingWithdrawals,
    adminProcessWithdrawal
} from '../controllers/wallet.controller';

const router = express.Router();

// =======================
// USER ROUTES (Wallet & KYC)
// =======================
router.get('/', protect, getWalletDashboard);
router.get('/transactions', protect, getTransactions);
router.post('/withdraw', protect, requestWithdrawal);
router.get('/withdrawals', protect, getWithdrawals);

router.post('/kyc', protect, submitKYC);
router.get('/referrals', protect, getReferrals);

// =======================
// ADMIN ROUTES (Withdrawals)
// =======================
router.get('/admin/withdrawals', protect, authorize('admin', 'founder'), adminGetPendingWithdrawals);
router.post('/admin/withdrawals/:withdrawalId/process', protect, authorize('admin', 'founder'), adminProcessWithdrawal);

export default router;
