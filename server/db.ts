import { eq, and, gte, lte, desc, asc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2";
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
  eventPartnerCompanies, InsertEventPartnerCompany,
  staffMessages, InsertStaffMessage,
  staffPhotos, InsertStaffPhoto,
  menuItems,
  eventMenuItems
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db) {
    try {
      const pool = createPool({
        host: 'localhost',
        port: 3306,
        user: 'u219024948_reginaldo',
        password: 'Pagotto24',
        database: 'u219024948_reginaldo',
        waitForConnections: true,
        connectionLimit: 10,
        ssl: undefined,
      });
      _db = drizzle(pool);
      console.log('[Database] Connected to MySQL successfully');
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
      email: user.email || '',
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "phone"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized as any;
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

export async function deleteService(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(services).where(eq(services.id, id));
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

export async function getClientById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select({ client: clients, user: users })
    .from(clients)
    .leftJoin(users, eq(clients.userId, users.id))
    .where(eq(clients.id, id))
    .limit(1);
  if (result.length === 0) return undefined;
  return {
    ...result[0].client,
    user: result[0].user ?? null,
    name: result[0].user?.name ?? null,
    email: result[0].user?.email ?? null,
    phone: result[0].user?.phone ?? null,
  };
}

export async function getAllClients() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({ client: clients, user: users })
    .from(clients)
    .leftJoin(users, eq(clients.userId, users.id))
    .orderBy(desc(clients.createdAt));
  
  return result.map(r => ({
    ...r.client,
    user: r.user ?? null,
    name: r.user?.name ?? null,
    email: r.user?.email ?? null,
    phone: r.user?.phone ?? null,
  }));
}

export async function deleteClient(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(clients).where(eq(clients.id, id));
}

export async function deleteEventsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(events).where(eq(events.clientId, clientId));
}

export async function deleteEvent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Remove staff assignments first
  await db.delete(eventStaffAssignments).where(eq(eventStaffAssignments.eventId, id));
  await db.delete(events).where(eq(events.id, id));
}

export async function updateClient(id: number, data: Partial<InsertClient>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(clients).set(data).where(eq(clients.id, id));
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

export async function deleteStaffMember(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(staffMembers).where(eq(staffMembers.id, id));
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
    specialties: Array.isArray(r.staff.specialties)
      ? r.staff.specialties
      : (typeof r.staff.specialties === 'string'
          ? (() => { try { return JSON.parse(r.staff.specialties as string); } catch { return []; } })()
          : []),
    user: r.user,
  }));
}

export async function updateStaffLocation(userId: number, latitude: number, longitude: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(staffMembers)
    .set({ latitude: String(latitude), longitude: String(longitude), updatedAt: new Date() })
    .where(eq(staffMembers.userId, userId));
}

export async function getActiveStaffLocations() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({
      id: staffMembers.id,
      userId: staffMembers.userId,
      latitude: staffMembers.latitude,
      longitude: staffMembers.longitude,
      updatedAt: staffMembers.updatedAt,
      name: users.name,
      phone: users.phone,
      profileImage: staffMembers.profileImage,
    })
    .from(staffMembers)
    .innerJoin(users, eq(staffMembers.userId, users.id))
    .where(eq(staffMembers.isActive, true));
  return rows.filter(r => r.latitude !== null && r.longitude !== null);
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
    specialties: Array.isArray(r.staff.specialties)
      ? r.staff.specialties
      : (typeof r.staff.specialties === 'string'
          ? (() => { try { return JSON.parse(r.staff.specialties as string); } catch { return []; } })()
          : []),
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
  
  // Buscar staff assignments
  const staffAssignments = await db
    .select({
      assignment: eventStaffAssignments,
      staff: staffMembers,
    })
    .from(eventStaffAssignments)
    .leftJoin(staffMembers, eq(eventStaffAssignments.staffId, staffMembers.id))
    .where(eq(eventStaffAssignments.eventId, id));
  
  return {
    ...result[0].event,
    client: result[0].client ? {
      ...result[0].client,
      name: result[0].user?.name,
      email: result[0].user?.email,
      phone: result[0].user?.phone,
    } : null,
    staffAssignments: staffAssignments.map(sa => ({
      ...sa.assignment,
      staff: sa.staff,
    })),
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
  const userId = result[0].insertId;
  const newUser = await getUserById(userId);
  return newUser;
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
  
  return await db
    .select({
      id: eventServices.id,
      eventId: eventServices.eventId,
      serviceId: eventServices.serviceId,
      serviceName: services.name,
      servicePrice: services.basePrice,
      serviceDescription: services.description,
    })
    .from(eventServices)
    .leftJoin(services, eq(eventServices.serviceId, services.id))
    .where(eq(eventServices.eventId, eventId));
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

// ============================================================================
// STAFF PORTAL FUNCTIONS
// ============================================================================

export async function getStaffByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(staffMembers).where(eq(staffMembers.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getStaffAssignedEvents(staffId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const assignments = await db
    .select()
    .from(eventStaffAssignments)
    .where(eq(eventStaffAssignments.staffId, staffId))
    .orderBy(desc(eventStaffAssignments.createdAt));
  
  // Buscar detalhes dos eventos
  const eventsWithDetails = await Promise.all(
    assignments.map(async (assignment) => {
      const eventDetails = await db
        .select()
        .from(events)
        .where(eq(events.id, assignment.eventId))
        .limit(1);
      
      return {
        ...assignment,
        event: eventDetails[0] || null,
      };
    })
  );
  
  return eventsWithDetails;
}

export async function updateStaffAssignmentStatus(assignmentId: number, status: 'invited' | 'accepted' | 'declined' | 'confirmed') {
  const db = await getDb();
  if (!db) return;
  
  await db
    .update(eventStaffAssignments)
    .set({ 
      status,
      respondedAt: new Date(),
    })
    .where(eq(eventStaffAssignments.id, assignmentId));
}

export async function staffCheckIn(assignmentId: number, location: { lat: number; lng: number; address?: string }) {
  const db = await getDb();
  if (!db) return;
  
  await db
    .update(eventStaffAssignments)
    .set({
      checkInTime: new Date(),
      checkInLocation: JSON.stringify(location),
    })
    .where(eq(eventStaffAssignments.id, assignmentId));
}

export async function staffCheckOut(assignmentId: number, location: { lat: number; lng: number; address?: string }) {
  const db = await getDb();
  if (!db) return;
  
  await db
    .update(eventStaffAssignments)
    .set({
      checkOutTime: new Date(),
      checkOutLocation: JSON.stringify(location),
    })
    .where(eq(eventStaffAssignments.id, assignmentId));
}

export async function createStaffMessage(message: { staffId: number; eventId?: number; senderId: number; senderRole: 'staff' | 'admin'; message: string }) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(staffMessages).values(message);
}

export async function getStaffMessages(staffId: number, eventId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  if (eventId) {
    return await db
      .select()
      .from(staffMessages)
      .where(and(eq(staffMessages.staffId, staffId), eq(staffMessages.eventId, eventId)))
      .orderBy(staffMessages.createdAt);
  }
  
  return await db
    .select()
    .from(staffMessages)
    .where(eq(staffMessages.staffId, staffId))
    .orderBy(staffMessages.createdAt);
}

export async function createStaffPhoto(photo: { staffId: number; eventId?: number; photoUrl: string; photoKey: string; caption?: string; isPrimary: boolean }) {
  const db = await getDb();
  if (!db) return;
  
  // Se é primary, remove primary de todas as outras fotos
  if (photo.isPrimary) {
    await db
      .update(staffPhotos)
      .set({ isPrimary: false })
      .where(eq(staffPhotos.staffId, photo.staffId));
  }
  
  await db.insert(staffPhotos).values(photo);
}

export async function getStaffPhotos(staffId: number, eventId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Construir condições de filtro
  const conditions = [eq(staffPhotos.staffId, staffId)];
  if (eventId) {
    conditions.push(eq(staffPhotos.eventId, eventId));
  }
  
  return await db
    .select()
    .from(staffPhotos)
    .where(and(...conditions))
    .orderBy(desc(staffPhotos.isPrimary), desc(staffPhotos.createdAt));
}

export async function deleteStaffPhoto(photoId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(staffPhotos).where(eq(staffPhotos.id, photoId));
}

export async function getEventPhotos(eventId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      id: staffPhotos.id,
      photoUrl: staffPhotos.photoUrl,
      photoKey: staffPhotos.photoKey,
      caption: staffPhotos.caption,
      createdAt: staffPhotos.createdAt,
      staffId: staffPhotos.staffId,
      staffName: users.name,
    })
    .from(staffPhotos)
    .leftJoin(staffMembers, eq(staffPhotos.staffId, staffMembers.id))
    .leftJoin(users, eq(staffMembers.userId, users.id))
    .where(eq(staffPhotos.eventId, eventId))
    .orderBy(desc(staffPhotos.createdAt));
}

export async function getEventMessages(eventId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      id: staffMessages.id,
      staffId: staffMessages.staffId,
      eventId: staffMessages.eventId,
      senderId: staffMessages.senderId,
      senderRole: staffMessages.senderRole,
      message: staffMessages.message,
      createdAt: staffMessages.createdAt,
      staffName: users.name,
    })
    .from(staffMessages)
    .leftJoin(staffMembers, eq(staffMessages.staffId, staffMembers.id))
    .leftJoin(users, eq(staffMembers.userId, users.id))
    .where(eq(staffMessages.eventId, eventId))
    .orderBy(staffMessages.createdAt);
}

export async function getStaffAssignmentById(assignmentId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(eventStaffAssignments)
    .where(eq(eventStaffAssignments.id, assignmentId))
    .limit(1);
  
  return result[0] || null;
}

// ============================================================================
// EVENT MENU ITEMS OPERATIONS
// ============================================================================

export async function addEventMenuItem(eventId: number, menuItemId: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Verificar se já existe
  const existing = await db
    .select()
    .from(eventMenuItems)
    .where(and(
      eq(eventMenuItems.eventId, eventId),
      eq(eventMenuItems.menuItemId, menuItemId)
    ))
    .limit(1);
  
  if (existing[0]) {
    // Atualizar quantidade
    await db
      .update(eventMenuItems)
      .set({ quantity: existing[0].quantity + quantity })
      .where(eq(eventMenuItems.id, existing[0].id));
  } else {
    // Inserir novo
    await db.insert(eventMenuItems).values({
      eventId,
      menuItemId,
      quantity,
    });
  }
}

export async function removeEventMenuItem(eventId: number, menuItemId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .delete(eventMenuItems)
    .where(and(
      eq(eventMenuItems.eventId, eventId),
      eq(eventMenuItems.menuItemId, menuItemId)
    ));
}

export async function getEventMenuItems(eventId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      id: eventMenuItems.id,
      eventId: eventMenuItems.eventId,
      menuItemId: eventMenuItems.menuItemId,
      quantity: eventMenuItems.quantity,
      menuItemName: menuItems.name,
      menuItemPrice: menuItems.price,
      menuItemDescription: menuItems.description,
    })
    .from(eventMenuItems)
    .leftJoin(menuItems, eq(eventMenuItems.menuItemId, menuItems.id))
    .where(eq(eventMenuItems.eventId, eventId));
}

// ============================================================================
// EVENT SERVICES OPERATIONS
// ============================================================================

export async function addEventService(eventId: number, serviceId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Verificar se já existe
  const existing = await db
    .select()
    .from(eventServices)
    .where(and(
      eq(eventServices.eventId, eventId),
      eq(eventServices.serviceId, serviceId)
    ))
    .limit(1);
  
  if (existing[0]) {
    return; // Já existe, não adicionar duplicado
  }
  
  await db.insert(eventServices).values({
    eventId,
    serviceId,
  });
}

export async function removeEventService(eventId: number, serviceId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .delete(eventServices)
    .where(and(
      eq(eventServices.eventId, eventId),
      eq(eventServices.serviceId, serviceId)
    ));
}


// ============================================================================
// USER AUTHENTICATION
// ============================================================================

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0] || null;
}

export async function updateUser(userId: number, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set(data).where(eq(users.id, userId));
}
