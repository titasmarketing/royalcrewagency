// OAuth removed - using JWT authentication
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { adminProcedure } from "./_core/adminProcedure";
import { inventoryRouter } from "./routers/inventory";
import { recruitmentRouter } from "./routers/recruitment";
import { documentsRouter } from "./routers/documents";
import { eventsRouter } from "./routers/events";
import { menuRouter } from "./routers/menu";
import { staffRouter } from "./routers/staff";
import { authRouter } from "./auth";

export const appRouter = router({
  system: systemRouter,
  inventory: inventoryRouter,
  recruitment: recruitmentRouter,
  documents: documentsRouter,
  events: eventsRouter,
  staff: staffRouter,
  menu: menuRouter,
  auth: authRouter,
  // OAuth removed - using JWT authentication

  // ============================================================================
  // SERVICES (CMS)
  // ============================================================================
  services: router({
    list: publicProcedure.query(async () => {
      return await db.getActiveServices();
    }),
    
    listAll: adminProcedure.query(async () => {
      return await db.getAllServices();
    }),
    
    featured: publicProcedure.query(async () => {
      return await db.getFeaturedServices();
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const service = await db.getServiceBySlug(input.slug);
        if (!service) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Service not found' });
        }
        return service;
      }),
    
    create: adminProcedure
      .input(z.object({
        slug: z.string(),
        name: z.string(),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        basePrice: z.string().optional(),
        isActive: z.boolean().default(true),
        isFeatured: z.boolean().default(false),
        coverImage: z.string().optional(),
        galleryImages: z.array(z.string()).optional(),
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createService(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        slug: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        basePrice: z.string().optional(),
        isActive: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
        coverImage: z.string().optional(),
        galleryImages: z.array(z.string()).optional(),
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateService(id, data);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteService(input.id);
        return { success: true };
      }),
  }),

  // ============================================================================
  // STAFF
  // ============================================================================
  staffAdmin: router({
    list: adminProcedure.query(async () => {
      return await db.getAllStaffMembers();
    }),
    
    active: adminProcedure.query(async () => {
      return await db.getActiveStaffMembers();
    }),
    
    myProfile: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'staff') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Staff access required' });
      }
      return await db.getStaffMemberByUserId(ctx.user.id);
    }),
    
    create: adminProcedure
      .input(z.object({
        userId: z.number(),
        specialties: z.array(z.string()).optional(),
        hourlyRate: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        county: z.string().optional(),
        profileImage: z.string().optional(),
        bio: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createStaffMember(input);
        return { success: true };
      }),

    createManual: adminProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
        specialties: z.array(z.string()).optional(),
        hourlyRate: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        county: z.string().optional(),
        postcode: z.string().optional(),
        bio: z.string().optional(),
        experience: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const drizzleDb = await db.getDb();
        if (!drizzleDb) throw new Error("Database not available");
        const { users: usersTable, staffMembers: staffTable } = await import("../drizzle/schema");
        const userResult = await drizzleDb.insert(usersTable).values({
          openId: `manual-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          name: input.name,
          email: input.email,
          role: "staff",
        });
        const userId = (userResult[0] as any).insertId;
        await drizzleDb.insert(staffTable).values({
          userId,
          specialties: input.specialties || [],
          hourlyRate: input.hourlyRate || null,
          phone: input.phone || null,
          address: input.address || null,
          city: input.city || null,
          county: input.county || null,
          postcode: input.postcode || null,
          bio: input.bio || null,
          experience: input.experience || null,
          status: "approved",
          isActive: input.isActive ?? true,
          rating: "0.00",
          totalEvents: 0,
        });
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        specialties: z.array(z.string()).optional(),
        hourlyRate: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        county: z.string().optional(),
        isActive: z.boolean().optional(),
        profileImage: z.string().optional(),
        bio: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateStaffMember(id, data);
        return { success: true };
      }),

    getAssignments: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getStaffAssignedEvents(input.id);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        // Remove assignments first, then delete staff member
        const drizzleDb = await db.getDb();
        if (!drizzleDb) throw new Error("Database not available");
        const { eventStaffAssignments: esa } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        await drizzleDb.delete(esa).where(eq(esa.staffId, input.id));
        await db.deleteStaffMember(input.id);
        return { success: true };
      }),
  }),

  // ============================================================================
  // CLIENTS
  // ============================================================================
  clients: router({
    list: adminProcedure.query(async () => {
      return await db.getAllClients();
    }),
    
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getClientById(input.id);
      }),
    
    myProfile: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'client') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Client access required' });
      }
      return await db.getClientByUserId(ctx.user.id);
    }),
    
    myEvents: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'client') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Client access required' });
      }
      const client = await db.getClientByUserId(ctx.user.id);
      if (!client) return [];
      return await db.getEventsByClientId(client.id);
    }),
    
    create: adminProcedure
      .input(z.object({
        userId: z.number(),
        companyName: z.string().optional(),
        document: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        county: z.string().optional(),
        zipCode: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createClient(input);
        return { success: true };
      }),

    createManual: adminProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
        companyName: z.string().optional(),
        document: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const drizzleDb = await db.getDb();
        if (!drizzleDb) throw new Error("Database not available");
        const { users: usersTable, clients: clientsTable } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        // Check if a user with this email already exists (orphaned from a deleted client)
        const existingUsers = await drizzleDb.select().from(usersTable).where(eq(usersTable.email, input.email)).limit(1);
        let userId: number;
        
        if (existingUsers.length > 0) {
          // Reuse the existing user (email was from a deleted client)
          const existingUser = existingUsers[0];
          // Check it's not linked to an active client
          const linkedClients = await drizzleDb.select().from(clientsTable).where(eq(clientsTable.userId, existingUser.id)).limit(1);
          if (linkedClients.length > 0) {
            throw new TRPCError({ code: 'CONFLICT', message: 'A client with this email already exists.' });
          }
          // Update the existing user with new info and reuse it
          await drizzleDb.update(usersTable).set({
            name: input.name,
            role: "client",
            openId: `manual-client-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          }).where(eq(usersTable.id, existingUser.id));
          userId = existingUser.id;
        } else {
          const userResult = await drizzleDb.insert(usersTable).values({
            openId: `manual-client-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            name: input.name,
            email: input.email,
            role: "client",
          });
          userId = (userResult[0] as any).insertId;
        }
        
        await drizzleDb.insert(clientsTable).values({
          userId,
          companyName: input.companyName || null,
          document: input.document || null,
          address: input.address || null,
          city: input.city || null,
          state: input.state || null,
          zipCode: input.zipCode || null,
          notes: input.notes || null,
        });
        return { success: true };
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        companyName: z.string().optional(),
        document: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        county: z.string().optional(),
        zipCode: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, name, email, phone, ...clientData } = input;
        // Update client table fields
        await db.updateClient(id, clientData);
        // Update user table fields (name, email, phone) if provided
        if (name !== undefined || email !== undefined || phone !== undefined) {
          const client = await db.getClientById(id);
          if (client?.userId) {
            const drizzleDb = await db.getDb();
            if (drizzleDb) {
              const { users: usersTable } = await import("../drizzle/schema");
              const { eq } = await import("drizzle-orm");
              const userUpdate: Record<string, unknown> = {};
              if (name !== undefined) userUpdate.name = name;
              if (email !== undefined) userUpdate.email = email;
              if (phone !== undefined) userUpdate.phone = phone;
              await drizzleDb.update(usersTable).set(userUpdate).where(eq(usersTable.id, client.userId));
            }
          }
        }
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number(), deleteEvents: z.boolean().default(true) }))
      .mutation(async ({ input }) => {
        // Get client to find userId before deleting
        const client = await db.getClientById(input.id);
        if (input.deleteEvents) {
          await db.deleteEventsByClientId(input.id);
        }
        await db.deleteClient(input.id);
        // Delete the associated user to free up the email
        if (client?.userId) {
          const drizzleDb = await db.getDb();
          if (drizzleDb) {
            const { users: usersTable } = await import("../drizzle/schema");
            const { eq } = await import("drizzle-orm");
            await drizzleDb.delete(usersTable).where(eq(usersTable.id, client.userId));
          }
        }
        return { success: true };
      }),
  }),

  // ============================================================================
  // GALLERY PHOTOS
  // ============================================================================
  gallery: router({
    list: publicProcedure.query(async () => {
      return await db.getAllGalleryPhotos();
    }),
    
    featured: publicProcedure
      .input(z.object({ limit: z.number().optional().default(4) }))
      .query(async ({ input }) => {
        return await db.getFeaturedGalleryPhotos(input.limit);
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        imageUrl: z.string(),
        imageKey: z.string(),
        category: z.enum(["weddings", "corporate_events", "private_parties", "conferences", "gala_dinners", "other"]).default("other"),
        isFeatured: z.boolean().default(false),
        displayOrder: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        await db.createGalleryPhoto(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        category: z.enum(["weddings", "corporate_events", "private_parties", "conferences", "gala_dinners", "other"]).optional(),
        isFeatured: z.boolean().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateGalleryPhoto(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteGalleryPhoto(input.id);
        return { success: true };
      }),
  }),

  // ============================================================================
  // PARTNER COMPANIES
  // ============================================================================
  partnerCompanies: router({
    list: adminProcedure.query(async () => {
      return await db.getAllPartnerCompanies();
    }),
    
    create: publicProcedure
      .input(z.object({
        companyName: z.string(),
        businessType: z.enum(["catering", "photography_video", "chef_services", "decoration", "sound_lighting", "transportation", "security", "cleaning", "other"]),
        contactPerson: z.string(),
        email: z.string().email(),
        phone: z.string(),
        address: z.string().optional(),
        city: z.string().optional(),
        county: z.string().optional(),
        postcode: z.string().optional(),
        servicesOffered: z.string().optional(),
        description: z.string().optional(),
        website: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createPartnerCompany(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        companyName: z.string().optional(),
        businessType: z.enum(["catering", "photography_video", "chef_services", "decoration", "sound_lighting", "transportation", "security", "cleaning", "other"]).optional(),
        contactPerson: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        county: z.string().optional(),
        postcode: z.string().optional(),
        servicesOffered: z.string().optional(),
        description: z.string().optional(),
        website: z.string().optional(),
        status: z.enum(["pending", "approved", "rejected"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updatePartnerCompany(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deletePartnerCompany(input.id);
        return { success: true };
      }),
  }),

  // ============================================================================
  // NOTIFICATIONS
  // ============================================================================
  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserNotifications(ctx.user.id);
    }),
    
    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.markNotificationAsRead(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
