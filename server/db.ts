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
  notifications, InsertNotification,
  partnerCompanies, InsertPartnerCompany,
  galleryPhotos, InsertGalleryPhoto,
  eventServices, InsertEventService,
  eventPartnerCompanies, InsertEventPartnerCompany
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
  
  const result = await db
    .select({
      event: events,
      client: clients,
      user: users,
    })
    .from(events)
    .leftJoin(clients, eq(events.clientId, clients.id))
    .leftJoin(users, eq(clients.userId, users.id))
    .where(eq(events.id, id))
    .limit(1);
  
  if (result.length === 0) return undefined;
  
  return {
    ...result[0].event,
    client: result[0].client ? {
      ...result[0].client,
      name: result[0].user?.name,
      email: result[0].user?.email,
      phone: result[0].user?.phone,
    } : null,
  };
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

export async function createUser(user: InsertUser) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(users).values(user);
  return result;
}

// ============================================================================
// SITE CONTENT (CMS) OPERATIONS
// ============================================================================
export async function createPartnerCompany(company: InsertPartnerCompany) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(partnerCompanies).values(company);
  return result;
}

export async function getAllPartnerCompanies() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(partnerCompanies).orderBy(desc(partnerCompanies.createdAt));
}

export async function getPartnerCompanyById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(partnerCompanies).where(eq(partnerCompanies.id, id));
  return result[0] || null;
}

export async function updatePartnerCompany(id: number, data: Partial<InsertPartnerCompany>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(partnerCompanies).set(data).where(eq(partnerCompanies.id, id));
}

export async function deletePartnerCompany(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(partnerCompanies).where(eq(partnerCompanies.id, id));
}

// ============================================================================
// GALLERY PHOTOS OPERATIONS
// ============================================================================

export async function createGalleryPhoto(photo: InsertGalleryPhoto) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(galleryPhotos).values(photo);
  return result;
}

export async function getAllGalleryPhotos() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(galleryPhotos).orderBy(asc(galleryPhotos.displayOrder), desc(galleryPhotos.createdAt));
}

export async function getFeaturedGalleryPhotos(limit: number = 4) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(galleryPhotos)
    .where(eq(galleryPhotos.isFeatured, true))
    .orderBy(asc(galleryPhotos.displayOrder))
    .limit(limit);
}

export async function getGalleryPhotoById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(galleryPhotos).where(eq(galleryPhotos.id, id));
  return result[0] || null;
}

export async function updateGalleryPhoto(id: number, data: Partial<InsertGalleryPhoto>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(galleryPhotos).set(data).where(eq(galleryPhotos.id, id));
}

export async function deleteGalleryPhoto(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(galleryPhotos).where(eq(galleryPhotos.id, id));
}

// ============================================================================
// EVENT EXTENDED OPERATIONS
// ============================================================================

export async function updateEventStatus(id: number, status: "quote" | "confirmed" | "in_progress" | "completed" | "cancelled") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(events).set({ status }).where(eq(events.id, id));
}

export async function updateEventNotes(id: number, notes: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(events).set({ notes }).where(eq(events.id, id));
}

// ============================================================================
// EVENT STAFF ASSIGNMENTS (Extended)
// ============================================================================

export async function assignStaffToEvent(eventId: number, staffId: number, role?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(eventStaffAssignments).values({
    eventId,
    staffId,
    role,
    status: "invited",
  });
  return result[0].insertId;
}

export async function removeStaffFromEvent(assignmentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(eventStaffAssignments).where(eq(eventStaffAssignments.id, assignmentId));
}

export async function getEventStaff(eventId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(eventStaffAssignments).where(eq(eventStaffAssignments.eventId, eventId));
}

// ============================================================================
// EVENT SERVICES
// ============================================================================

export async function addServiceToEvent(eventId: number, serviceId: number, quantity: number = 1, price?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [result] = await db.insert(eventServices).values({
    eventId,
    serviceId,
    quantity,
    price: price?.toString(),
  });
  return result.insertId;
}

export async function removeServiceFromEvent(eventServiceId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(eventServices).where(eq(eventServices.id, eventServiceId));
}

export async function getEventServices(eventId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(eventServices).where(eq(eventServices.eventId, eventId));
}

// ============================================================================
// EVENT PARTNER COMPANIES
// ============================================================================

export async function addPartnerCompanyToEvent(eventId: number, partnerCompanyId: number, role?: string, notes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [result] = await db.insert(eventPartnerCompanies).values({
    eventId,
    partnerCompanyId,
    role,
    notes,
  });
  return result.insertId;
}

export async function removePartnerCompanyFromEvent(eventPartnerCompanyId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(eventPartnerCompanies).where(eq(eventPartnerCompanies.id, eventPartnerCompanyId));
}

export async function getEventPartnerCompanies(eventId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(eventPartnerCompanies).where(eq(eventPartnerCompanies.eventId, eventId));
}

// ============================================================================
// EVENT INVENTORY
// ============================================================================

export async function addInventoryToEvent(eventId: number, itemId: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [result] = await db.insert(eventInventoryRequests).values({
    eventId,
    itemId,
    quantityRequested: quantity,
    status: "pending",
  });
  return result.insertId;
}

export async function removeInventoryFromEvent(inventoryRequestId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(eventInventoryRequests).where(eq(eventInventoryRequests.id, inventoryRequestId));
}

export async function getEventInventory(eventId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(eventInventoryRequests).where(eq(eventInventoryRequests.eventId, eventId));
}

// ============================================================================
// EVENT CALCULATIONS
// ============================================================================

export async function calculateEventTotalPrice(eventId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  // Get all services for this event
  const eventServicesList = await db.select().from(eventServices).where(eq(eventServices.eventId, eventId));
  
  let total = 0;
  for (const es of eventServicesList) {
    const price = es.price ? parseFloat(es.price) : 0;
    total += price * es.quantity;
  }
  
  // Update event total price
  await db.update(events).set({ totalPrice: total.toString() }).where(eq(events.id, eventId));
  
  return total;
}
