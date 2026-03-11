import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import { Client } from 'pg';

async function run() {
    console.log('Connecting to neon database...');
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    
    await client.connect();
    console.log('Connected! Read schema.sql');
    
    const schema = fs.readFileSync('schema.sql', 'utf8');
    
    // We can just run the whole schema string with node-pg because it supports multiple statements
    try {
        await client.query(schema);
        console.log('Schema applied successfully!');
    } catch(err) {
        console.error('Error applying schema: ', err);
    } finally {
        await client.end();
    }
}

run();
