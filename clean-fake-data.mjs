import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment variables");
  process.exit(1);
}

async function cleanFakeData() {
  const connection = await mysql.createConnection(DATABASE_URL);

  console.log("🗑️  Cleaning all fake data from database...\n");

  try {
    // Delete in correct order to respect foreign key constraints
    
    console.log("Deleting staff photos...");
    await connection.execute("DELETE FROM staff_photos");
    
    console.log("Deleting staff messages...");
    await connection.execute("DELETE FROM staff_messages");
    
    console.log("Deleting event staff assignments...");
    await connection.execute("DELETE FROM event_staff_assignments");
    
    console.log("Deleting event menu items...");
    await connection.execute("DELETE FROM event_menu_items");
    
    console.log("Deleting event services...");
    await connection.execute("DELETE FROM event_services");
    
    console.log("Deleting events...");
    await connection.execute("DELETE FROM events");
    
    console.log("Deleting menu items...");
    await connection.execute("DELETE FROM menu_items");
    
    console.log("Deleting services...");
    await connection.execute("DELETE FROM services");
    
    console.log("Deleting partner companies...");
    await connection.execute("DELETE FROM partner_companies");
    
    console.log("Deleting clients...");
    await connection.execute("DELETE FROM clients");
    
    console.log("Deleting non-admin users...");
    await connection.execute("DELETE FROM users WHERE role != 'admin'");

    console.log("\n✅ All fake data cleaned successfully!");
    console.log("🔐 Admin users preserved:");
    console.log("   - contato@lirolla.com / Pagotto24");
    console.log("   - contato@royalcrewagency.com / Reginaldo07");
    console.log("\n📊 Database is now clean and ready for real data!");
    console.log("📸 Gallery is empty - ready for you to upload photos!");

  } catch (error) {
    console.error("❌ Error cleaning data:", error);
  } finally {
    await connection.end();
  }
}

cleanFakeData();
