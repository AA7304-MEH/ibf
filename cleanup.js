const fs = require('fs');
const path = require('path');

console.log('🧹 Starting IBF Platform Cleanup...');

// Since we are in root, we assume client/src instead of frontend/src based on environment
const BASE_DIR = path.join(process.cwd(), 'client', 'src');

const patternsToRemove = [
    'Proof of Work',
    'Encrypted Trust',
    'Network Endpoint',
    'Execute Mission',
    'SolEarn',
    'SolLearn',
    'skillBridge',
    'SkillBridge',
];

const filesToDelete = [
    'components/crypto/',
    'components/mission/',
    'components/nodes/',
    'pages/ExecuteMission.jsx',
    'pages/MissionControl.jsx',
    'pages/Nodes.jsx',
    'pages/CryptoDashboard.jsx',
    'assets/crypto-icons/',
];

// Delete files
filesToDelete.forEach(file => {
    const fullPath = path.join(BASE_DIR, file);
    if (fs.existsSync(fullPath)) {
        if (fs.lstatSync(fullPath).isDirectory()) {
            fs.rmSync(fullPath, { recursive: true, force: true });
            console.log(`Deleted folder: ${file}`);
        } else {
            fs.unlinkSync(fullPath);
            console.log(`Deleted file: ${file}`);
        }
    }
});

console.log('Cleanup Complete!');
