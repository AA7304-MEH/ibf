const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Profile = require('./models/Profile');

dotenv.config();

const initDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Refined Init...');

        // Clear existing data (CAUTION: MVP ONLY)
        await User.deleteMany({});
        await Profile.deleteMany({});
        console.log('Cleared existing data');

        const salt = await bcrypt.genSalt(10);
        const adminHash = await bcrypt.hash('admin123', salt);

        // 1. Create Admin
        const admin = new User({
            email: 'admin@ibf.com',
            passwordHash: adminHash,
            role: 'admin',
            isProfileComplete: true
        });
        await admin.save();
        await new Profile({ userId: admin._id, fullName: 'System Admin' }).save();

        // 2. Create Founder
        const founderHash = await bcrypt.hash('founder123', salt);
        const founder = new User({
            email: 'founder@test.com',
            passwordHash: founderHash,
            role: 'founder',
            isProfileComplete: true
        });
        await founder.save();
        await new Profile({
            userId: founder._id,
            fullName: 'Jane Founder',
            startupName: 'EcoTech',
            startupPitch: 'Sustainable energy solutions.',
            startupStage: 'Prototype',
            incubatorStatus: 'accepted'
        }).save();

        // 3. Create Student
        const studentHash = await bcrypt.hash('student123', salt);
        const student = new User({
            email: 'student@test.com',
            passwordHash: studentHash,
            role: 'student',
            isProfileComplete: true
        });
        await student.save();
        await new Profile({
            userId: student._id,
            fullName: 'Junior Dev',
            age: 17,
            school: 'East High',
            parentalConsentVerified: true
        }).save();

        console.log('Refined seed data created successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

initDB();
