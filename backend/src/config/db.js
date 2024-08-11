import { Sequelize } from 'sequelize';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Determine the current environment (default to 'development')
const env = process.env.NODE_ENV || 'development';

// Read the database config file
const configPath = resolve('config', 'database.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'))[env];

// Initialize Sequelize with the config for the current environment
export const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: env === 'development' ? console.log : false, // Disable logging; change to console.log to see queries
});
