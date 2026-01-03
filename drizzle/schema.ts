import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * GOD MODE - Royal Crew Agency
 * Complete database schema for event management platform
 */

// ============================================================================
// USERS & AUTHENTICATION
// ============================================================================

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["admin", "staff", "client"]).default("client").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================================
// SITE CONTENT (CMS)
// ============================================================================

export const siteContent = mysqlTable("site_content", {
  id: int("id").autoincrement().primaryKey(),
  section: varchar("section", { length: 100 }).notNull().unique(),
  content: text("content").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteContent = typeof siteContent.$inferSelect;
export type InsertSiteContent = typeof siteContent.$inferInsert;

// ============================================================================
// SERVICES (CMS)
// ============================================================================

export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  shortDescription: varchar("shortDescription", { length: 500 }),
  basePrice: decimal("basePrice", { precision: 10, scale: 2 }),
  isActive: boolean("isActive").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  coverImage: text("coverImage"),
  galleryImages: json("galleryImages").$type<string[]>(),
  seoTitle: varchar("seoTitle", { length: 255 }),
  seoDescription: varchar("seoDescription", { length: 500 }),
  seoKeywords: text("seoKeywords"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

// ============================================================================
// CLIENTS
// ============================================================================

export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  companyName: varchar("companyName", { length: 255 }),
  document: varchar("document", { length: 50 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  zipCode: varchar("zipCode", { length: 20 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

// ============================================================================
// STAFF MEMBERS
// ============================================================================

export const staffMembers = mysqlTable("staff_members", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  specialties: json("specialties").$type<string[]>(),
  hourlyRate: decimal("hourlyRate", { precision: 10, scale: 2 }),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalEvents: int("totalEvents").default(0).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  address: varchar("address", { length: 255 }),
  city: varchar("city", { length: 100 }),
  county: varchar("county", { length: 100 }),
  postcode: varchar("postcode", { length: 10 }),
  isActive: boolean("isActive").default(true).notNull(),
  profileImage: text("profileImage"),
  bio: text("bio"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  phone: varchar("phone", { length: 20 }),
  experience: text("experience"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StaffMember = typeof staffMembers.$inferSelect;
export type InsertStaffMember = typeof staffMembers.$inferInsert;

// ============================================================================
// STAFF AVAILABILITY
// ============================================================================

export const staffAvailability = mysqlTable("staff_availability", {
  id: int("id").autoincrement().primaryKey(),
  staffId: int("staffId").notNull(),
  date: timestamp("date").notNull(),
  isAvailable: boolean("isAvailable").default(true).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StaffAvailability = typeof staffAvailability.$inferSelect;
export type InsertStaffAvailability = typeof staffAvailability.$inferInsert;

// ============================================================================
// EVENTS
// ============================================================================

export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  serviceId: int("serviceId"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["quote", "confirmed", "in_progress", "completed", "cancelled"]).default("quote").notNull(),
  eventDate: timestamp("eventDate").notNull(),
  startTime: varchar("startTime", { length: 10 }),
  endTime: varchar("endTime", { length: 10 }),
  location: text("location"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  totalPrice: decimal("totalPrice", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["stripe", "bank_transfer", "cash"]),
  paymentLink: text("paymentLink"),
  bankAccountDetails: text("bankAccountDetails"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// ============================================================================
// EVENT STAFF ASSIGNMENTS
// ============================================================================

export const eventStaffAssignments = mysqlTable("event_staff_assignments", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  staffId: int("staffId").notNull(),
  role: varchar("role", { length: 100 }),
  status: mysqlEnum("status", ["invited", "accepted", "declined", "confirmed"]).default("invited").notNull(),
  payment: decimal("payment", { precision: 10, scale: 2 }),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "bonus"]).default("pending").notNull(),
  invitedAt: timestamp("invitedAt").defaultNow().notNull(),
  respondedAt: timestamp("respondedAt"),
  checkInTime: timestamp("checkInTime"),
  checkOutTime: timestamp("checkOutTime"),
  checkInLocation: text("checkInLocation"), // JSON: {lat, lng, address}
  checkOutLocation: text("checkOutLocation"), // JSON: {lat, lng, address}
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EventStaffAssignment = typeof eventStaffAssignments.$inferSelect;
export type InsertEventStaffAssignment = typeof eventStaffAssignments.$inferInsert;

// ============================================================================
// EVENT TRACKING (Real-time status)
// ============================================================================

export const eventTracking = mysqlTable("event_tracking", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull().unique(),
  status: mysqlEnum("status", ["pending", "team_dispatched", "team_on_location", "service_started", "service_completed"]).default("pending").notNull(),
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EventTracking = typeof eventTracking.$inferSelect;
export type InsertEventTracking = typeof eventTracking.$inferInsert;

// ============================================================================
// PAYMENTS
// ============================================================================

export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId"),
  clientId: int("clientId"),
  staffId: int("staffId"),
  type: mysqlEnum("type", ["client_payment", "staff_payment"]).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "paid", "cancelled"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  transactionId: varchar("transactionId", { length: 255 }),
  dueDate: timestamp("dueDate"),
  paidAt: timestamp("paidAt"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

// ============================================================================
// DOCUMENTS
// ============================================================================

export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  type: mysqlEnum("type", ["contract", "service_order", "invoice"]).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileKey: varchar("fileKey", { length: 500 }),
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

// ============================================================================
// INVENTORY ITEMS
// ============================================================================

export const inventoryItems = mysqlTable("inventory_items", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  unit: varchar("unit", { length: 50 }),
  currentStock: int("currentStock").default(0).notNull(),
  minStock: int("minStock").default(0).notNull(),
  unitCost: decimal("unitCost", { precision: 10, scale: 2 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InsertInventoryItem = typeof inventoryItems.$inferInsert;

// ============================================================================
// SERVICE INVENTORY KITS
// ============================================================================

export const serviceInventoryKits = mysqlTable("service_inventory_kits", {
  id: int("id").autoincrement().primaryKey(),
  serviceId: int("serviceId").notNull(),
  itemId: int("itemId").notNull(),
  quantity: int("quantity").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ServiceInventoryKit = typeof serviceInventoryKits.$inferSelect;
export type InsertServiceInventoryKit = typeof serviceInventoryKits.$inferInsert;

// ============================================================================
// EVENT INVENTORY REQUESTS
// ============================================================================

export const eventInventoryRequests = mysqlTable("event_inventory_requests", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  itemId: int("itemId").notNull(),
  quantityRequested: int("quantityRequested").notNull(),
  quantityUsed: int("quantityUsed"),
  status: mysqlEnum("status", ["pending", "allocated", "used", "returned"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EventInventoryRequest = typeof eventInventoryRequests.$inferSelect;
export type InsertEventInventoryRequest = typeof eventInventoryRequests.$inferInsert;

// ============================================================================
// EVENT SERVICES
// ============================================================================

export const eventServices = mysqlTable("event_services", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  serviceId: int("serviceId").notNull(),
  quantity: int("quantity").default(1).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EventService = typeof eventServices.$inferSelect;
export type InsertEventService = typeof eventServices.$inferInsert;

// ============================================================================
// EVENT PARTNER COMPANIES
// ============================================================================

export const eventPartnerCompanies = mysqlTable("event_partner_companies", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  partnerCompanyId: int("partnerCompanyId").notNull(),
  role: varchar("role", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EventPartnerCompany = typeof eventPartnerCompanies.$inferSelect;
export type InsertEventPartnerCompany = typeof eventPartnerCompanies.$inferInsert;

// ============================================================================
// STAFF REVIEWS
// ============================================================================

export const staffReviews = mysqlTable("staff_reviews", {
  id: int("id").autoincrement().primaryKey(),
  staffId: int("staffId").notNull(),
  eventId: int("eventId").notNull(),
  clientId: int("clientId").notNull(),
  rating: int("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StaffReview = typeof staffReviews.$inferSelect;
export type InsertStaffReview = typeof staffReviews.$inferInsert;

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  data: json("data"),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// ============================================================================
// GALLERY PHOTOS
// ============================================================================

export const galleryPhotos = mysqlTable("gallery_photos", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl").notNull(),
  imageKey: varchar("imageKey", { length: 500 }).notNull(),
  category: mysqlEnum("category", [
    "weddings",
    "corporate_events",
    "private_parties",
    "conferences",
    "gala_dinners",
    "other"
  ]).default("other").notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GalleryPhoto = typeof galleryPhotos.$inferSelect;
export type InsertGalleryPhoto = typeof galleryPhotos.$inferInsert;

// ============================================================================
// PARTNER COMPANIES
// ============================================================================

export const partnerCompanies = mysqlTable("partner_companies", {
  id: int("id").autoincrement().primaryKey(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  businessType: mysqlEnum("businessType", [
    "catering",
    "photography_video",
    "chef_services",
    "decoration",
    "sound_lighting",
    "transportation",
    "security",
    "cleaning",
    "other"
  ]).notNull(),
  contactPerson: varchar("contactPerson", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  county: varchar("county", { length: 100 }),
  postcode: varchar("postcode", { length: 20 }),
  servicesOffered: text("servicesOffered"),
  description: text("description"),
  website: varchar("website", { length: 500 }),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PartnerCompany = typeof partnerCompanies.$inferSelect;
export type InsertPartnerCompany = typeof partnerCompanies.$inferInsert;

// ============================================================================
// MENU ITEMS
// ============================================================================

export const menuItems = mysqlTable("menu_items", {
  id: int("id").autoincrement().primaryKey(),
  category: mysqlEnum("category", ["Starters", "Main Course", "Desserts", "Beverages", "Other"]).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  ingredients: text("ingredients"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  imageKey: varchar("imageKey", { length: 500 }),
  displayOrder: int("displayOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = typeof menuItems.$inferInsert;

// ============================================================================
// EVENT MENU SELECTIONS
// ============================================================================

export const eventMenuSelections = mysqlTable("event_menu_selections", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  menuItemId: int("menuItemId").notNull(),
  quantity: int("quantity").default(1),
  price: decimal("price", { precision: 10, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EventMenuSelection = typeof eventMenuSelections.$inferSelect;
export type InsertEventMenuSelection = typeof eventMenuSelections.$inferInsert;

// ============================================================================
// STAFF MESSAGES (Chat staff-admin)
// ============================================================================

export const staffMessages = mysqlTable("staff_messages", {
  id: int("id").autoincrement().primaryKey(),
  staffId: int("staffId").notNull(),
  eventId: int("eventId"),
  senderId: int("senderId").notNull(), // userId que enviou
  senderRole: mysqlEnum("senderRole", ["staff", "admin"]).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StaffMessage = typeof staffMessages.$inferSelect;
export type InsertStaffMessage = typeof staffMessages.$inferInsert;

// ============================================================================
// STAFF PHOTOS (Galeria de fotos do staff)
// ============================================================================

export const staffPhotos = mysqlTable("staff_photos", {
  id: int("id").autoincrement().primaryKey(),
  staffId: int("staffId").notNull(),
  eventId: int("eventId"), // Fotos vinculadas a eventos específicos
  photoUrl: text("photoUrl").notNull(),
  photoKey: text("photoKey").notNull(), // S3 key para deletar
  caption: text("caption"), // Descrição da foto
  isPrimary: boolean("isPrimary").default(false).notNull(), // Avatar principal
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StaffPhoto = typeof staffPhotos.$inferSelect;
export type InsertStaffPhoto = typeof staffPhotos.$inferInsert;

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ one, many }) => ({
  client: one(clients, {
    fields: [users.id],
    references: [clients.userId],
  }),
  staffMember: one(staffMembers, {
    fields: [users.id],
    references: [staffMembers.userId],
  }),
  notifications: many(notifications),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, {
    fields: [clients.userId],
    references: [users.id],
  }),
  events: many(events),
  payments: many(payments),
}));

export const staffMembersRelations = relations(staffMembers, ({ one, many }) => ({
  user: one(users, {
    fields: [staffMembers.userId],
    references: [users.id],
  }),
  availability: many(staffAvailability),
  assignments: many(eventStaffAssignments),
  reviews: many(staffReviews),
  payments: many(payments),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  events: many(events),
  inventoryKits: many(serviceInventoryKits),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  client: one(clients, {
    fields: [events.clientId],
    references: [clients.id],
  }),
  service: one(services, {
    fields: [events.serviceId],
    references: [services.id],
  }),
  staffAssignments: many(eventStaffAssignments),
  tracking: one(eventTracking, {
    fields: [events.id],
    references: [eventTracking.eventId],
  }),
  payments: many(payments),
  documents: many(documents),
  inventoryRequests: many(eventInventoryRequests),
  reviews: many(staffReviews),
}));

export const eventStaffAssignmentsRelations = relations(eventStaffAssignments, ({ one }) => ({
  event: one(events, {
    fields: [eventStaffAssignments.eventId],
    references: [events.id],
  }),
  staff: one(staffMembers, {
    fields: [eventStaffAssignments.staffId],
    references: [staffMembers.id],
  }),
}));

export const inventoryItemsRelations = relations(inventoryItems, ({ many }) => ({
  serviceKits: many(serviceInventoryKits),
  eventRequests: many(eventInventoryRequests),
}));
