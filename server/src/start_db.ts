import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs';
import path from 'path';

const startDB = async () => {
    try {
        const mongod = await MongoMemoryServer.create({
            instance: {
                port: 27017,
                dbPath: path.join(__dirname, '../db'),
                storageEngine: 'wiredTiger'
            }
        });
        const uri = mongod.getUri();
        console.log('MongoDB Memory Server started');
        console.log('URI:', uri);

        // Write to .env file or a temp file
        const envPath = path.join(__dirname, '../.env');

        // Read existing .env
        let envContent = '';
        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
        }

        // Replace or Append MONGODB_URI
        if (envContent.includes('MONGODB_URI=')) {
            envContent = envContent.replace(/MONGODB_URI=.*/, `MONGODB_URI=${uri}`);
        } else {
            envContent += `\nMONGODB_URI=${uri}\n`;
        }

        fs.writeFileSync(envPath, envContent);
        console.log('Updated .env with URI');

        // Keep alive
        setInterval(() => { }, 10000);
        console.log('DB running. Press Ctrl+C to stop.');
    } catch (err) {
        console.error('Failed to start DB:', err);
    }
};

startDB();
