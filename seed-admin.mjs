import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment variables");
  process.exit(1);
}

async function seedAdmin() {
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);

  console.log("🌱 Creating admin user...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  try {
    await connection.execute(
      `INSERT INTO users (email, password, name, role, loginMethod, createdAt, updatedAt, lastSignedIn) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW(), NOW())
       ON DUPLICATE KEY UPDATE password = VALUES(password), role = VALUES(role)`,
      ["admin@royalcrew.com", hashedPassword, "Admin User", "admin", "email"]
    );

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@royalcrew.com");
    console.log("🔑 Password: admin123");
    console.log("\n⚠️  IMPORTANT: Change this password after first login!");

  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    await connection.end();
  }
}

seedAdmin();
