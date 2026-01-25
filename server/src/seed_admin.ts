import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
// import bcrypt from 'bcryptjs'; // Let the model handle hashing

dotenv.config();

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ibf', {
            // Mongoose 6+ args (deprecated but harmless usually, or removed in 7?) 
            // Leaving empty is best for modern mongoose
        });
        console.log('Connected to MongoDB');

        // 1. Admin
        let admin = await User.findOne({ email: 'admin@ibf.com' });
        if (!admin) {
            await User.create({
                email: 'admin@ibf.com',
                password: 'admin123',
                role: 'admin',
                firstName: 'Super',
                lastName: 'Admin',
                isVerified: true
            });
            console.log('Created Admin: admin@ibf.com / admin123');
        } else {
            console.log('Admin already exists.');
        }

        // 2. Talent
        let talent = await User.findOne({ email: 'talent1@code.com' });
        if (!talent) {
            await User.create({
                email: 'talent1@code.com',
                password: 'password123',
                role: 'talent',
                firstName: 'Tanya',
                lastName: 'Talent',
                isVerified: true,
                skills: [{ name: 'React', level: 'advanced' }, { name: 'Node.js', level: 'intermediate' }]
            });
            console.log('Created Talent: talent1@code.com / password123');
        } else {
            console.log('Talent user already exists.');
        }

        // 3. Student
        let student = await User.findOne({ email: 'student1@school.edu' });
        if (!student) {
            await User.create({
                email: 'student1@school.edu',
                password: 'password123',
                role: 'student',
                firstName: 'Sam',
                lastName: 'Student',
                isVerified: true,
                schoolDetails: { name: 'Innovation High', grade: '11th' },
                dateOfBirth: new Date('2009-01-01')
            });
            console.log('Created Student: student1@school.edu / password123');
        } else {
            console.log('Student user already exists.');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedUsers();
