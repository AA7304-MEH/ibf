import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    type: 'earning' | 'withdrawal' | 'referral_bonus' | 'refund';
    amount: number; // positive for credits, negative for debits (in paise)
    balanceAfter: number; // calculated atomic balance after this tx
    description: string;
    referenceId?: mongoose.Types.ObjectId; // ID of TaskAttempt or Withdrawal
    createdAt: Date;
}

const TransactionSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['earning', 'withdrawal', 'referral_bonus', 'refund'],
        required: true
    },
    amount: { type: Number, required: true },
    balanceAfter: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    referenceId: { type: mongoose.Schema.Types.ObjectId },
    createdAt: { type: Date, default: Date.now }
});

TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ referenceId: 1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
