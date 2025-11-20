
import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const DB_NAME = process.env.DB_NAME || 'sustenta_plus';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'root';
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_DIALECT = 'mysql';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: false,
  timezone: '-03:00',
  define: {
    underscored: true,
    timestamps: true,
  }
});

export default sequelize;