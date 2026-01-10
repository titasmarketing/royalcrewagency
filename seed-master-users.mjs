import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment variables");
  process.exit(1);
}

async function seedMasterUsers() {
  const connection = await mysql.createConnection(DATABASE_URL);

  console.log("🌱 Creating 2 master admin users...\n");

  // Primeiro, deletar usuários antigos de teste
  await connection.execute(`DELETE FROM users WHERE email IN ('admin@royalcrew.com')`);
  console.log("🗑️  Removed old test users\n");

  const users = [
    {
      email: "contato@lirolla.com",
      password: "Pagotto24",
      name: "Lirolla Master",
      role: "admin"
    },
    {
      email: "contato@royalcrewagency.com",
      password: "Reginaldo07",
      name: "Royal Crew Master",
      role: "admin"
    }
  ];

  try {
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      await connection.execute(
        `INSERT INTO users (email, password, name, role, loginMethod, createdAt, updatedAt, lastSignedIn) 
         VALUES (?, ?, ?, ?, ?, NOW(), NOW(), NOW())
         ON DUPLICATE KEY UPDATE password = VALUES(password), role = VALUES(role), name = VALUES(name)`,
        [user.email, hashedPassword, user.name, user.role, "email"]
      );

      console.log(`✅ ADMIN user created:`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🔑 Password: ${user.password}`);
      console.log(`   👤 Name: ${user.name}`);
      console.log("");
    }

    console.log("🎉 Master admin users created successfully!");
    console.log("\n📝 Login credentials (both have FULL ADMIN access):");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("1. contato@lirolla.com / Pagotto24");
    console.log("2. contato@royalcrewagency.com / Reginaldo07");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n✨ Both users have ADMIN role = access to all portals!");

  } catch (error) {
    console.error("❌ Error creating users:", error);
  } finally {
    await connection.end();
  }
}

seedMasterUsers();
