import Database from "better-sqlite3";
import bcrypt from "bcrypt";

const db = new Database(process.env.DATABASE_URL.replace('file:', ''));

console.log("\n=== CURRENT USERS ===");
const users = db.prepare("SELECT id, email, name, role FROM users").all();
console.table(users);

console.log("\n=== RECREATING ADMIN USERS ===");

// Delete existing users
db.prepare("DELETE FROM users WHERE email IN (?, ?)").run(
  'contato@lirolla.com',
  'contato@royalcrewagency.com'
);

// Create new admin users with hashed passwords
const hashedPassword1 = bcrypt.hashSync('Pagotto24', 10);
const hashedPassword2 = bcrypt.hashSync('Reginaldo07', 10);

db.prepare(`
  INSERT INTO users (email, name, password, role, loginMethod)
  VALUES (?, ?, ?, ?, ?)
`).run('contato@lirolla.com', 'Lirolla Admin', hashedPassword1, 'admin', 'jwt');

db.prepare(`
  INSERT INTO users (email, name, password, role, loginMethod)
  VALUES (?, ?, ?, ?, ?)
`).run('contato@royalcrewagency.com', 'Royal Crew Admin', hashedPassword2, 'admin', 'jwt');

console.log("\n✅ Admin users created:");
console.log("1. contato@lirolla.com / Pagotto24");
console.log("2. contato@royalcrewagency.com / Reginaldo07");

console.log("\n=== UPDATED USERS ===");
const updatedUsers = db.prepare("SELECT id, email, name, role FROM users").all();
console.table(updatedUsers);

db.close();
