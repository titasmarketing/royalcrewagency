import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { adminProcedure } from "./_core/adminProcedure";
import { inventoryRouter } from "./routers/inventory";

export const appRouter = router({
  system: systemRouter,
  inventory: inventoryRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

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
  }),

  // ============================================================================
  // EVENTS
  // ============================================================================
  events: router({
    list: adminProcedure.query(async () => {
      return await db.getAllEvents();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const event = await db.getEventById(input.id);
        if (!event) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' });
        }
        
        // Check permissions
        if (ctx.user.role === 'client') {
          const client = await db.getClientByUserId(ctx.user.id);
          if (!client || event.clientId !== client.id) {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
          }
        }
        
        return event;
      }),
    
    getByDateRange: adminProcedure
      .input(z.object({
        startDate: z.date(),
        endDate: z.date(),
      }))
      .query(async ({ input }) => {
        return await db.getEventsByDateRange(input.startDate, input.endDate);
      }),
    
    create: adminProcedure
      .input(z.object({
        clientId: z.number(),
        serviceId: z.number().optional(),
        title: z.string(),
        description: z.string().optional(),
        status: z.enum(["quote", "confirmed", "in_progress", "completed", "cancelled"]).default("quote"),
        eventDate: z.date(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        location: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        totalPrice: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createEvent(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        clientId: z.number().optional(),
        serviceId: z.number().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["quote", "confirmed", "in_progress", "completed", "cancelled"]).optional(),
        eventDate: z.date().optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        location: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        totalPrice: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateEvent(id, data);
        return { success: true };
      }),
  }),

  // ============================================================================
  // STAFF
  // ============================================================================
  staff: router({
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
        state: z.string().optional(),
        profileImage: z.string().optional(),
        bio: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createStaffMember(input);
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
        state: z.string().optional(),
        isActive: z.boolean().optional(),
        profileImage: z.string().optional(),
        bio: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateStaffMember(id, data);
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
        state: z.string().optional(),
        zipCode: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createClient(input);
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
