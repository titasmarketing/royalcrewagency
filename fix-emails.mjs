import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Update null emails to unique values
await connection.query(`
  UPDATE users 
  SET email = CONCAT('user', id, '@temp.local')
  WHERE email IS NULL OR email = ''
`);

console.log('✅ Fixed duplicate emails');
await connection.end();
