import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment variables");
  process.exit(1);
}

async function seedMasterUsers() {
  const connection = await mysql.createConnection(DATABASE_URL);

  console.log("🌱 Creating master users for all 3 portals...\n");

  const users = [
    {
      email: "admin@royalcrew.com",
      password: "admin123",
      name: "Admin Master",
      role: "admin"
    },
    {
      email: "contato@lirolla.com",
      password: "Pagotto24",
      name: "Lirolla Client",
      role: "client"
    },
    {
      email: "contato@royalcrewagency.com",
      password: "Reginaldo07",
      name: "Royal Crew Staff",
      role: "staff"
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

      console.log(`✅ ${user.role.toUpperCase()} user created:`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🔑 Password: ${user.password}`);
      console.log(`   👤 Role: ${user.role}`);
      console.log("");
    }

    console.log("🎉 All master users created successfully!");
    console.log("\n📝 Login credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("ADMIN Portal: admin@royalcrew.com / admin123");
    console.log("CLIENT Portal: contato@lirolla.com / Pagotto24");
    console.log("STAFF Portal: contato@royalcrewagency.com / Reginaldo07");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  } catch (error) {
    console.error("❌ Error creating users:", error);
  } finally {
    await connection.end();
  }
}

seedMasterUsers();
