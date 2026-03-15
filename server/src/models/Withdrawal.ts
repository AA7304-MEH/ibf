import mongoose, { Document, Schema } from 'mongoose';

export interface IWithdrawal extends Document {
    userId: mongoose.Types.ObjectId;
    amount: number; // in paise
    method: 'razorpay' | 'upi' | 'bank_transfer';
    accountDetails: {
        razorpayContactId?: string;
        razorpayFundAccountId?: string;
        razorpayPayoutId?: string;
        upiId?: string;
        accountNumber?: string;
        ifscCode?: string;
    };
    status: 'pending' | 'approved' | 'rejected' | 'paid';
    processedAt?: Date;
    processedBy?: mongoose.Types.ObjectId; // admin ID
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const WithdrawalSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 10000 }, // min 100 INR (10000 paise)
    method: {
        type: String,
        enum: ['razorpay', 'upi', 'bank_transfer'],
        default: 'razorpay'
    },
    accountDetails: {
        razorpayContactId: String,
        razorpayFundAccountId: String,
        razorpayPayoutId: String,
        upiId: String,
        accountNumber: String,
        ifscCode: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'paid'],
        default: 'pending'
    },
    processedAt: { type: Date },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String }
}, {
    timestamps: true
});

WithdrawalSchema.index({ userId: 1, status: 1 });
WithdrawalSchema.index({ status: 1 });

export default mongoose.model<IWithdrawal>('Withdrawal', WithdrawalSchema);
