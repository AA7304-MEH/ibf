import mongoose from 'mongoose';

export interface IContract extends mongoose.Document {
    project: mongoose.Types.ObjectId;
    client: mongoose.Types.ObjectId; // Founder
    freelancer: mongoose.Types.ObjectId; // Talent
    totalAmount: number;
    status: 'active' | 'completed' | 'disputed' | 'cancelled';
    escrowStatus: 'funded' | 'released' | 'refunded';
    milestones: {
        title: string;
        amount: number;
        status: 'pending' | 'active' | 'completed' | 'paid';
        dueDate?: Date;
    }[];
    startDate: Date;
    endDate?: Date;
}

const ContractSchema = new mongoose.Schema<IContract>({
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['active', 'completed', 'disputed', 'cancelled'],
        default: 'active'
    },
    escrowStatus: {
        type: String,
        enum: ['funded', 'released', 'refunded'],
        default: 'funded'
    },
    milestones: [{
        title: String,
        amount: Number,
        status: { type: String, enum: ['pending', 'active', 'completed', 'paid'], default: 'pending' },
        dueDate: Date
    }],
    startDate: { type: Date, default: Date.now },
    endDate: Date
}, { timestamps: true });

export default mongoose.model<IContract>('Contract', ContractSchema);
