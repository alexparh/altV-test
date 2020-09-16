import chalk from 'chalk';
import { Database } from 'simplymongo';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    url: process.env['MONGO_URL'] ? process.env['MONGO_URL'] : 'mongodb://localhost:27017',
    database: process.env['MONGO_DB'] ? process.env['MONGO_DB'] : 'os-auth',
    username: process.env['MONGO_USER'] ? process.env['MONGO_USER'] : null,
    password: process.env['MONGO_PASS'] ? process.env['MONGO_PASS'] : null,
    collections: ['accounts']
};

// Establish Database Singleton
new Database(config.url, config.database, config.collections, config.username, config.password);

// alt:V Resources
import './auth';

console.log(chalk.greenBright('[OS] Authentication - Started'));