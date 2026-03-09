import { neon } from '@neondatabase/serverless';

const dbUrl = (typeof process !== 'undefined' && process.env?.DATABASE_URL) || 
               (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DATABASE_URL);

const sql = neon(dbUrl);

export default sql;
