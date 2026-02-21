/**
 * LIGHTWEIGHT UNIFIED DEV SERVER
 * No TypeScript, no MongoDB.
 * Serves BOTH the API and the Frontend (Built Dist).
 * Designed for extremely low memory environments.
 */

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'skillbridge_dev_secret_key_123';

// ============== MIDDLEWARE ==============
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());

// Serve static files from the client/dist directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// ============== IN-MEMORY DATA STORE ==============
const db = {
    users: [],
    startups: [],
    projects: [],
    applications: [],
    internships: [],
    collabs: [],
    wellbeingMetrics: [],
    learningPaths: [],
    gamification: [],
    talentProfiles: [],
    badges: []
};

// Helper: generate ID
let idCounter = 1000;
const genId = () => String(++idCounter);

// Helper: generate token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '30d' });
};

// Helper: auth middleware
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token invalid' });
    }
};

// ============== SEED DATA ==============
async function seedData() {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const hashedFounder = await bcrypt.hash('founder123', 10);
    const hashedStudent = await bcrypt.hash('student123', 10);

    db.users.push(
        { _id: 'admin_001', firstName: 'System', lastName: 'Admin', email: 'admin@ibf.com', password: hashedPassword, role: 'admin', isVerified: true, xp: 0, level: 1, badges: [], loginStreak: 0 },
        { _id: 'founder_001', firstName: 'Test', lastName: 'Founder', email: 'founder@test.com', password: hashedFounder, role: 'founder', isVerified: true, xp: 150, level: 2, badges: [], loginStreak: 3 },
        { _id: 'student_001', firstName: 'Test', lastName: 'Student', email: 'student@test.com', password: hashedStudent, role: 'student', isVerified: true, xp: 50, level: 1, badges: [], loginStreak: 1, consentStatus: 'verified' }
    );

    db.startups.push(
        { _id: 'startup_001', name: 'Future AgTech', tagline: 'Revolutionizing AgTech', description: 'AI-powered agriculture solutions.', industry: 'AgTech', founder: 'founder_001', stage: 'mvp', incubatorStatus: 'accepted', metrics: { users: 450, revenue: 25000, growthRate: 65 } },
        { _id: 'startup_002', name: 'Future FinTech', tagline: 'Revolutionizing FinTech', description: 'AI-powered finance solutions.', industry: 'FinTech', founder: 'founder_001', stage: 'mvp', incubatorStatus: 'accepted', metrics: { users: 820, revenue: 40000, growthRate: 80 } },
        { _id: 'startup_003', name: 'Future BioTech', tagline: 'Revolutionizing BioTech', description: 'AI-powered biotech solutions.', industry: 'BioTech', founder: 'admin_001', stage: 'growth', incubatorStatus: 'accepted', metrics: { users: 200, revenue: 15000, growthRate: 45 } },
        { _id: 'startup_004', name: 'Future EdTech', tagline: 'Revolutionizing EdTech', description: 'AI-powered education solutions.', industry: 'EdTech', founder: 'admin_001', stage: 'mvp', incubatorStatus: 'applied', metrics: { users: 100, revenue: 5000, growthRate: 30 } },
        { _id: 'startup_005', name: 'Future CleanEnergy', tagline: 'Revolutionizing CleanEnergy', description: 'AI-powered clean energy solutions.', industry: 'CleanEnergy', founder: 'admin_001', stage: 'idea', incubatorStatus: 'accepted', metrics: { users: 50, revenue: 2000, growthRate: 90 } }
    );

    db.projects.push(
        { _id: 'proj_001', title: 'EcoTrack: Carbon Footprint Monitor', description: 'A real-time dashboard for tracking personal carbon usage.', skillsRequired: ['React', 'Node.js', 'Sustainability'], projectType: 'general', postedBy: 'admin_001', status: 'open', tags: ['Sustainability', 'GreenTech'], duration: '4 weeks', difficultyTier: 'Builder' },
        { _id: 'proj_002', title: 'MindfulVR: Meditation App', description: 'Virtual reality meditation experiences for mental health.', skillsRequired: ['Unity', 'C#', 'Wellness'], projectType: 'skillswap', postedBy: 'admin_001', status: 'in_progress', tags: ['Wellness', 'VR'], duration: '8 weeks', difficultyTier: 'Innovator' },
        { _id: 'proj_003', title: 'LocalEats: Food Rescue Platform', description: 'Connecting local restaurants with shelters to reduce waste.', skillsRequired: ['Mobile', 'Flutter', 'Social Impact'], projectType: 'general', postedBy: 'founder_001', status: 'open', tags: ['Social Impact', 'FoodTech'], duration: '6 weeks', difficultyTier: 'Builder' }
    );

    db.internships.push(
        { _id: 'intern_001', title: 'Frontend Developer Intern', company: 'Future AgTech', startup: 'startup_001', description: 'Build UI components for our agriculture dashboard.', skillsRequired: ['React', 'CSS', 'JavaScript'], duration: '3 months', status: 'open', postedBy: 'founder_001' },
        { _id: 'intern_002', title: 'Data Science Intern', company: 'Future FinTech', startup: 'startup_002', description: 'Analyze financial datasets and build ML models.', skillsRequired: ['Python', 'ML', 'Statistics'], duration: '6 months', status: 'open', postedBy: 'founder_001' }
    );

    db.talentProfiles.push(
        { _id: 'talent_001', userId: 'student_001', name: 'Test Student', headline: 'Aspiring Full Stack Developer', bio: 'Learning React and Node.js at IBF.', skills: [{ name: 'React', level: 'beginner', years: 1 }], rates: { hourly: 25, projectMin: 100 }, availability: { status: 'available', hoursPerWeek: 15 }, statistics: { successScore: 100, completedProjects: 0 }, badges: ['rising-star'] }
    );

    db.badges.push(
        { _id: 'badge_001', name: 'Rising Star', description: 'Started your first course', icon: '⭐', category: 'milestone', criteria: 'Start a course', rarity: 'common' },
        { _id: 'badge_002', name: 'First Mission', description: 'Completed first micro-internship', icon: '🚀', category: 'achievement', criteria: 'Complete 1 internship', rarity: 'common' }
    );

    console.log(`Seeded: ${db.users.length} users, ${db.startups.length} startups, ${db.projects.length} projects, ${db.internships.length} internships, ${db.talentProfiles.length} talent profiles`);
}

// ============== AUTH ROUTES ==============
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, role, firstName, lastName, dateOfBirth, schoolDetails, parentInfo } = req.body;
        if (db.users.find(u => u.email === email)) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = { _id: genId(), email, password: hashed, role: role || 'talent', firstName, lastName, dateOfBirth, schoolDetails, parentInfo, isVerified: true, xp: 0, level: 1, badges: [], loginStreak: 0 };
        db.users.push(user);
        console.log(`[Register] ${email} as ${user.role}`);
        res.status(201).json({ _id: user._id, email: user.email, role: user.role, token: generateToken(user._id, user.role) });
    } catch (error) {
        console.error('[Register Error]', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`[Login Attempt] ${email}`);
        const user = db.users.find(u => u.email === email);
        if (!user) {
            console.log(`[Login Failed] User not found: ${email}`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password.trim(), user.password);
        if (!isMatch) {
            console.log(`[Login Failed] Password mismatch for ${email}. Provided: "${password.trim()}"`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        console.log(`[Login Success] ${email} (${user.role})`);
        res.json({ _id: user._id, email: user.email, role: user.role, firstName: user.firstName, token: generateToken(user._id, user.role) });
    } catch (error) {
        console.error('[Login Error]', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
    const user = db.users.find(u => u._id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

// ============== PROJECT ROUTES ==============
app.get('/api/projects', (req, res) => {
    res.json(db.projects);
});

app.get('/api/projects/:id', (req, res) => {
    const project = db.projects.find(p => p._id === req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const poster = db.users.find(u => u._id === project.postedBy);
    res.json({ ...project, postedByUser: poster ? { firstName: poster.firstName, lastName: poster.lastName, email: poster.email } : null });
});

app.post('/api/projects', authMiddleware, (req, res) => {
    const project = { _id: genId(), ...req.body, postedBy: req.user.id, status: 'open', createdAt: new Date() };
    db.projects.push(project);
    res.status(201).json(project);
});

app.post('/api/projects/:id/apply', authMiddleware, (req, res) => {
    const application = { _id: genId(), projectId: req.params.id, applicantId: req.user.id, message: req.body.message, status: 'pending', appliedAt: new Date() };
    db.applications.push(application);
    res.status(201).json(application);
});

// ============== STARTUP ROUTES ==============
app.get('/api/startups', (req, res) => {
    res.json(db.startups);
});

app.get('/api/startups/:id', (req, res) => {
    const startup = db.startups.find(s => s._id === req.params.id);
    if (!startup) return res.status(404).json({ message: 'Startup not found' });
    res.json(startup);
});

app.post('/api/startups', authMiddleware, (req, res) => {
    const startup = { _id: genId(), ...req.body, founder: req.user.id, createdAt: new Date() };
    db.startups.push(startup);
    res.status(201).json(startup);
});

// ============== INCUBATOR ROUTES ==============
app.get('/api/incubator/startups', (req, res) => {
    const accepted = db.startups.filter(s => s.incubatorStatus === 'accepted');
    res.json(accepted);
});

app.post('/api/incubator/apply', authMiddleware, (req, res) => {
    const existing = db.startups.find(s => s.founder === req.user.id);
    if (existing) {
        existing.incubatorStatus = 'applied';
        return res.json(existing);
    }
    const startup = { _id: genId(), ...req.body, founder: req.user.id, incubatorStatus: 'applied' };
    db.startups.push(startup);
    res.status(201).json(startup);
});

app.post('/api/incubator/copilot', authMiddleware, (req, res) => {
    const { prompt, startupId } = req.body;
    const startup = db.startups.find(s => s._id === startupId) || db.startups[0];

    // Simple mock AI logic
    let advice = "Focus on your core value proposition. Given your stage, prioritize user feedback over perfect features.";
    if (prompt.toLowerCase().includes('burn') || prompt.toLowerCase().includes('money')) {
        advice = "Watch your burn rate closely. Looking at your metrics, I'd suggest extending your runway by 2 months by optimizing cloud costs.";
    } else if (prompt.toLowerCase().includes('hiring') || prompt.toLowerCase().includes('team')) {
        advice = "At this stage, you need generalists who can wear multiple hats. Look for 'T-shaped' talent.";
    }

    res.json({ advice });
});

// ============== ECOSYSTEM / SYMBIOSIS ROUTES ==============
app.get('/api/ecosystem/dashboard', authMiddleware, (req, res) => {
    res.json({
        startups: db.startups,
        totalStartups: db.startups.length,
        totalProjects: db.projects.length,
        totalUsers: db.users.length,
        industries: [...new Set(db.startups.map(s => s.industry))],
        analysis: {
            topIndustries: [
                { name: 'AgTech', count: db.startups.filter(s => s.industry === 'AgTech').length },
                { name: 'FinTech', count: db.startups.filter(s => s.industry === 'FinTech').length },
                { name: 'EdTech', count: db.startups.filter(s => s.industry === 'EdTech').length },
            ],
            overallGrowth: 45,
            synergyScore: 78
        }
    });
});

app.get('/api/symbiosis/opportunities', authMiddleware, (req, res) => {
    res.json([
        { id: 'syn_1', type: 'collaboration', startups: ['Future AgTech', 'Future BioTech'], description: 'Joint research on bio-agriculture AI', score: 92 },
        { id: 'syn_2', type: 'resource_sharing', startups: ['Future FinTech', 'Future EdTech'], description: 'Shared data infrastructure', score: 85 },
    ]);
});

// ============== INTERNSHIP ROUTES ==============
app.get('/api/internships', (req, res) => {
    res.json(db.internships);
});

app.get('/api/internships/:id', (req, res) => {
    const internship = db.internships.find(i => i._id === req.params.id);
    if (!internship) return res.status(404).json({ message: 'Internship not found' });
    res.json(internship);
});

app.post('/api/internships', authMiddleware, (req, res) => {
    const internship = { _id: genId(), ...req.body, postedBy: req.user.id, status: 'open', createdAt: new Date() };
    db.internships.push(internship);
    res.status(201).json(internship);
});

app.post('/api/internships/:id/apply', authMiddleware, (req, res) => {
    const application = { _id: genId(), internshipId: req.params.id, applicantId: req.user.id, message: req.body.message || '', status: 'pending', appliedAt: new Date() };
    db.applications.push(application);
    res.status(201).json(application);
});

// ============== COLLAB ROUTES ==============
app.get('/api/collab/projects', (req, res) => {
    res.json(db.projects.filter(p => p.status === 'open'));
});

app.post('/api/collab/apply', authMiddleware, (req, res) => {
    const { projectId, coverLetter } = req.body;
    if (db.applications.find(a => a.project === projectId && a.applicantId === req.user.id)) {
        return res.status(400).json({ message: 'Already applied' });
    }
    const application = { _id: genId(), project: projectId, applicantId: req.user.id, coverLetter, status: 'pending', appliedAt: new Date() };
    db.applications.push(application);
    res.status(201).json(application);
});

// ============== SKILLSWAP ROUTES ==============
app.get('/api/skillswap/projects', (req, res) => {
    res.json(db.projects.filter(p => p.projectType === 'skillswap'));
});

// ============== WELLBEING ROUTES ==============
app.get('/api/wellbeing/check', authMiddleware, (req, res) => {
    res.json({ mood: 'good', stressLevel: 3, recommendation: 'Take a 5-minute break!', lastCheck: new Date() });
});

app.post('/api/wellbeing/log', authMiddleware, (req, res) => {
    const entry = { _id: genId(), userId: req.user.id, ...req.body, createdAt: new Date() };
    db.wellbeingMetrics.push(entry);
    res.status(201).json(entry);
});

app.get('/api/wellbeing/dashboard', authMiddleware, (req, res) => {
    const metrics = db.wellbeingMetrics.filter(m => m.userId === req.user.id);
    res.json({ metrics, average: { mood: 4, stress: 3, energy: 4 }, streak: 5 });
});

// ============== LEARNING PATH ROUTES ==============
app.get('/api/learning-path', authMiddleware, (req, res) => {
    res.json([
        { _id: 'lp_001', title: 'Web Development Foundations', progress: 45, modules: 12, completedModules: 5, status: 'in-progress' },
        { _id: 'lp_002', title: 'Frontend Mastery', progress: 20, modules: 8, completedModules: 2, status: 'unlocked' },
        { _id: 'lp_003', title: 'Backend Foundations', progress: 0, modules: 10, completedModules: 0, status: 'locked' },
        { _id: 'lp_004', title: 'Database Architecture', progress: 0, modules: 6, completedModules: 0, status: 'locked' },
        { _id: 'lp_005', title: 'Cloud & Deployment', progress: 0, modules: 5, completedModules: 0, status: 'locked' },
    ]);
});

app.get('/api/learning/recommendations', authMiddleware, (req, res) => {
    res.json([
        { title: 'Advanced React Patterns', type: 'course', difficulty: 'intermediate', duration: '2 hours' },
        { title: 'Node.js Best Practices', type: 'article', difficulty: 'beginner', duration: '15 min' },
    ]);
});

// ============== GAMIFICATION ROUTES ==============
app.get('/api/gamification/profile', authMiddleware, (req, res) => {
    const user = db.users.find(u => u._id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ xp: user.xp || 0, level: user.level || 1, badges: user.badges || [], loginStreak: user.loginStreak || 0, rank: 'Rising Star' });
});

app.get('/api/gamification/leaderboard', (req, res) => {
    const leaderboard = db.users
        .filter(u => u.role !== 'admin')
        .sort((a, b) => (b.xp || 0) - (a.xp || 0))
        .slice(0, 10)
        .map((u, i) => ({ rank: i + 1, _id: u._id, firstName: u.firstName, lastName: u.lastName, xp: u.xp || 0, level: u.level || 1 }));
    res.json(leaderboard);
});

// ============== PARENT ROUTES ==============
app.get('/api/parent/dashboard', authMiddleware, (req, res) => {
    res.json({ childActivity: [], consentRequests: [], notifications: [] });
});



// ============== HEALTH CHECK ==============
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', mode: 'lightweight-dev', timestamp: new Date(), dataStore: 'in-memory' });
});

app.get('/api-status', (req, res) => {
    res.send('IBF Platform API (Lightweight Dev Mode) is running');
});

// ============== CLIENT-SIDE ROUTING FALLBACK ==============
// IMPORTANT: Use RegExp for catch-all in Express 5 to avoid path-to-regexp string syntax issues
app.get(/.* /, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// ============== START ==============
seedData().then(() => {
    app.listen(PORT, () => {
        console.log('');
        console.log('========================================');
        console.log(`  IBF UNIFIED Server running on port ${PORT}`);
        console.log('  Serving BOTH: Backend API and Frontend');
        console.log('  Mode: Lightweight (In-Memory Data)');
        console.log('========================================');
        console.log('');
        console.log('  Test Accounts:');
        console.log('  Admin:   admin@ibf.com / admin123');
        console.log('  Founder: founder@test.com / founder123');
        console.log('  Student: student@test.com / student123');
        console.log('');
    });
});
