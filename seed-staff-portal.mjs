import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment');
  process.exit(1);
}

async function seed() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    console.log('🌱 Seeding Staff Portal data...\n');

    // 1. Criar usuário staff
    const [staffUser] = await connection.execute(
      `INSERT INTO users (name, email, password, role, created_at, updated_at) 
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      ['John Smith', 'john.staff@royalcrew.com', 'hashed_password', 'staff']
    );
    const staffUserId = staffUser.insertId;
    console.log('✅ Created staff user: John Smith');

    // 2. Criar staff member
    const [staffMember] = await connection.execute(
      `INSERT INTO staff_members (user_id, position, hourly_rate, skills, bio, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [staffUserId, 'Waiter', 25.00, 'Customer Service, Food Service', 'Experienced waiter with 5+ years in luxury events']
    );
    const staffId = staffMember.insertId;
    console.log('✅ Created staff member profile');

    // 3. Criar cliente
    const [clientUser] = await connection.execute(
      `INSERT INTO users (name, email, password, role, phone, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      ['Sarah Johnson', 'sarah@example.com', 'hashed_password', 'client', '+44 7700 900123']
    );
    const clientUserId = clientUser.insertId;

    const [client] = await connection.execute(
      `INSERT INTO clients (user_id, company_name, created_at, updated_at)
       VALUES (?, ?, NOW(), NOW())`,
      [clientUserId, 'Johnson Events Ltd']
    );
    const clientId = client.insertId;
    console.log('✅ Created client: Sarah Johnson');

    // 4. Criar 3 eventos
    const events = [
      {
        title: 'Corporate Gala Dinner',
        description: 'Annual company celebration with 200 guests',
        eventDate: new Date('2026-02-15'),
        location: 'The Savoy Hotel, London',
        guestCount: 200,
        status: 'confirmed'
      },
      {
        title: 'Wedding Reception',
        description: 'Elegant wedding reception',
        eventDate: new Date('2026-03-20'),
        location: 'Hampton Court Palace',
        guestCount: 150,
        status: 'quote'
      },
      {
        title: 'Product Launch Party',
        description: 'Tech startup product launch',
        eventDate: new Date('2026-01-25'),
        location: 'Sky Garden, London',
        guestCount: 100,
        status: 'confirmed'
      }
    ];

    const eventIds = [];
    for (const event of events) {
      const [result] = await connection.execute(
        `INSERT INTO events (client_id, title, description, event_date, location, guest_count, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [clientId, event.title, event.description, event.eventDate, event.location, event.guestCount, event.status]
      );
      eventIds.push(result.insertId);
      console.log(`✅ Created event: ${event.title}`);
    }

    // 5. Assign staff to events with different statuses
    const assignments = [
      { eventId: eventIds[0], status: 'invited', role: 'Head Waiter' },
      { eventId: eventIds[1], status: 'accepted', role: 'Waiter', checkIn: true },
      { eventId: eventIds[2], status: 'accepted', role: 'Server' }
    ];

    for (const assignment of assignments) {
      const checkInTime = assignment.checkIn ? new Date('2026-01-25T17:30:00') : null;
      const checkInLocation = assignment.checkIn ? '51.5074,-0.1278' : null;

      await connection.execute(
        `INSERT INTO event_staff_assignments (event_id, staff_id, role, status, check_in_time, check_in_location, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [assignment.eventId, staffId, assignment.role, assignment.status, checkInTime, checkInLocation]
      );
      console.log(`✅ Assigned staff to event (status: ${assignment.status})`);
    }

    // 6. Criar mensagens de exemplo
    await connection.execute(
      `INSERT INTO staff_messages (staff_id, event_id, sender_id, message, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [staffId, eventIds[0], staffUserId, 'Hi admin, what time should I arrive for the Corporate Gala?']
    );
    console.log('✅ Created sample message');

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📧 Login credentials:');
    console.log('   Email: john.staff@royalcrew.com');
    console.log('   Password: (use your OAuth login)');
    console.log('\n🔗 Access Staff Portal: /staff/portal');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

seed().catch(console.error);
