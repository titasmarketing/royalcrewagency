import { eq, and, gte, lte, desc, asc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users,
  services, InsertService,
  clients, InsertClient,
  staffMembers, InsertStaffMember,
  staffAvailability, InsertStaffAvailability,
  events, InsertEvent,
  eventStaffAssignments, InsertEventStaffAssignment,
  eventTracking, InsertEventTracking,
  payments, InsertPayment,
  documents, InsertDocument,
  inventoryItems, InsertInventoryItem,
  serviceInventoryKits, InsertServiceInventoryKit,
  eventInventoryRequests, InsertEventInventoryRequest,
  staffReviews, InsertStaffReview,
  notifications, InsertNotification
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================================
// USER OPERATIONS
// ============================================================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "phone"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// SERVICE OPERATIONS (CMS)
// ============================================================================

export async function createService(service: InsertService) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(services).values(service);
  return result;
}

export async function updateService(id: number, service: Partial<InsertService>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(services).set(service).where(eq(services.id, id));
}

export async function getServiceBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllServices() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(services).orderBy(desc(services.createdAt));
}

export async function getActiveServices() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(services).where(eq(services.isActive, true)).orderBy(desc(services.createdAt));
}

export async function getFeaturedServices() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(services).where(and(eq(services.isActive, true), eq(services.isFeatured, true))).orderBy(desc(services.createdAt));
}

// ============================================================================
// CLIENT OPERATIONS
// ============================================================================

export async function createClient(client: InsertClient) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(clients).values(client);
  return result;
}

export async function getClientByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(clients).where(eq(clients.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllClients() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(clients).orderBy(desc(clients.createdAt));
}

// ============================================================================
// STAFF OPERATIONS
// ============================================================================

export async function createStaffMember(staff: InsertStaffMember) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(staffMembers).values(staff);
  return result;
}

export async function updateStaffMember(id: number, staff: Partial<InsertStaffMember>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(staffMembers).set(staff).where(eq(staffMembers.id, id));
}

export async function getStaffMemberByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select({
      staff: staffMembers,
      user: users,
    })
    .from(staffMembers)
    .leftJoin(users, eq(staffMembers.userId, users.id))
    .where(eq(staffMembers.userId, userId))
    .limit(1);
  
  if (result.length === 0) return undefined;
  
  return {
    ...result[0].staff,
    user: result[0].user,
  };
}

export async function getAllStaffMembers() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      staff: staffMembers,
      user: users,
    })
    .from(staffMembers)
    .leftJoin(users, eq(staffMembers.userId, users.id))
    .orderBy(desc(staffMembers.rating));
  
  return result.map(r => ({
    ...r.staff,
    user: r.user,
  }));
}

export async function getActiveStaffMembers() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      staff: staffMembers,
      user: users,
    })
    .from(staffMembers)
    .leftJoin(users, eq(staffMembers.userId, users.id))
    .where(eq(staffMembers.isActive, true))
    .orderBy(desc(staffMembers.rating));
  
  return result.map(r => ({
    ...r.staff,
    user: r.user,
  }));
}

// ============================================================================
// STAFF AVAILABILITY OPERATIONS
// ============================================================================

export async function setStaffAvailability(availability: InsertStaffAvailability) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(staffAvailability).values(availability);
  return result;
}

export async function getStaffAvailabilityByDate(staffId: number, date: Date) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(staffAvailability)
    .where(and(eq(staffAvailability.staffId, staffId), eq(staffAvailability.date, date)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getStaffAvailabilityRange(staffId: number, startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(staffAvailability)
    .where(and(
      eq(staffAvailability.staffId, staffId),
      gte(staffAvailability.date, startDate),
      lte(staffAvailability.date, endDate)
    ))
    .orderBy(asc(staffAvailability.date));
}

// ============================================================================
// EVENT OPERATIONS
// ============================================================================

export async function createEvent(event: InsertEvent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(events).values(event);
  return result;
}

export async function updateEvent(id: number, event: Partial<InsertEvent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(events).set(event).where(eq(events.id, id));
}

export async function getEventById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllEvents() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(events).orderBy(desc(events.eventDate));
}

export async function getEventsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(events).where(eq(events.clientId, clientId)).orderBy(desc(events.eventDate));
}

export async function getEventsByDateRange(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(events)
    .where(and(
      gte(events.eventDate, startDate),
      lte(events.eventDate, endDate)
    ))
    .orderBy(asc(events.eventDate));
}

// ============================================================================
// EVENT STAFF ASSIGNMENT OPERATIONS
// ============================================================================

export async function createEventStaffAssignment(assignment: InsertEventStaffAssignment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(eventStaffAssignments).values(assignment);
  return result;
}

export async function updateEventStaffAssignment(id: number, assignment: Partial<InsertEventStaffAssignment>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(eventStaffAssignments).set(assignment).where(eq(eventStaffAssignments.id, id));
}

export async function getEventStaffAssignments(eventId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(eventStaffAssignments).where(eq(eventStaffAssignments.eventId, eventId));
}

export async function getStaffAssignments(staffId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(eventStaffAssignments).where(eq(eventStaffAssignments.staffId, staffId)).orderBy(desc(eventStaffAssignments.invitedAt));
}

// ============================================================================
// NOTIFICATION OPERATIONS
// ============================================================================

export async function createNotification(notification: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(notifications).values(notification);
  return result;
}

export async function getUserNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
}

// ============================================================================
// PAYMENT OPERATIONS
// ============================================================================

export async function createPayment(payment: InsertPayment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(payments).values(payment);
  return result;
}

export async function getStaffPayments(staffId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(payments).where(eq(payments.staffId, staffId)).orderBy(desc(payments.createdAt));
}

export async function getClientPayments(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(payments).where(eq(payments.clientId, clientId)).orderBy(desc(payments.createdAt));
}

// ============================================================================
// INVENTORY OPERATIONS
// ============================================================================

export async function createInventoryItem(item: InsertInventoryItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(inventoryItems).values(item);
  return result;
}

export async function getAllInventoryItems() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(inventoryItems).orderBy(asc(inventoryItems.name));
}

export async function getLowStockItems() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(inventoryItems)
    .where(sql`${inventoryItems.currentStock} <= ${inventoryItems.minStock}`)
    .orderBy(asc(inventoryItems.currentStock));
}
