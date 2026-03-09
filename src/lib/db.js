import { neon } from '@neondatabase/serverless';

const sql = neon(import.meta.env.VITE_DATABASE_URL || process.env.DATABASE_URL);

export default sql;
