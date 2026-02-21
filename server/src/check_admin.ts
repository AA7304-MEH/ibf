
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkAdmin = async () => {
    try {
        console.log('Connecting to DB...');
        // Force local connection if not set
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillbridge';
        await mongoose.connect(uri);
        console.log('Connected to:', uri);

        // Import User Model (using dynamic import to handle TS execution via ts-node if needed or regular require)
        const User = (await import('./models/User')).default;

        const adminEmail = 'admin@ibf.com';
        const adminPassword = 'adminpassword123';

        const admin = await User.findOne({ email: adminEmail }).select('+password');

        if (admin) {
            console.log('Admin user FOUND.');
            console.log('ID:', admin._id);
            console.log('Role:', admin.role);
            console.log('Hashed Password:', admin.password);

            // Check password manually
            const isMatch = await admin.comparePassword(adminPassword);
            console.log('Password Match Check:', isMatch ? 'SUCCESS' : 'FAILED');

            if (!isMatch) {
                console.log('Updating password to default...');
                admin.password = adminPassword;
                await admin.save();
                console.log('Password updated and re-hashed.');
            }
        } else {
            console.log('Admin user NOT FOUND. Creating...');
            const newAdmin = await User.create({
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                isVerified: true,
                isProfileComplete: true,
                firstName: 'Admin',
                lastName: 'User'
            });
            console.log('Admin user created successfully.');
            console.log('ID:', newAdmin._id);
        }

        await mongoose.disconnect();
        console.log('Done.');
    } catch (error) {
        console.error('Error:', error);
    }
};

checkAdmin();
