import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import { users } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log("\n=== CURRENT USERS ===");
const currentUsers = await db.select().from(users);
console.table(currentUsers.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role })));

console.log("\n=== DELETING OLD ADMIN USERS ===");
await db.delete(users).where(eq(users.email, 'contato@lirolla.com'));
await db.delete(users).where(eq(users.email, 'contato@royalcrewagency.com'));

console.log("\n=== CREATING NEW ADMIN USERS ===");
const hashedPassword1 = await bcrypt.hash('Pagotto24', 10);
const hashedPassword2 = await bcrypt.hash('Reginaldo07', 10);

await db.insert(users).values({
  email: 'contato@lirolla.com',
  name: 'Lirolla Admin',
  password: hashedPassword1,
  role: 'admin',
  loginMethod: 'jwt'
});

await db.insert(users).values({
  email: 'contato@royalcrewagency.com',
  name: 'Royal Crew Admin',
  password: hashedPassword2,
  role: 'admin',
  loginMethod: 'jwt'
});

console.log("\n✅ Admin users created:");
console.log("1. contato@lirolla.com / Pagotto24");
console.log("2. contato@royalcrewagency.com / Reginaldo07");

console.log("\n=== UPDATED USERS ===");
const updatedUsers = await db.select().from(users);
console.table(updatedUsers.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role })));

await connection.end();
