import { router, publicProcedure } from "../_core/trpc";
import { adminProcedure } from "../_core/adminProcedure";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "../db";

export const eventsRouter = router({
  // ============================================================================
  // CREATE EVENT + CLIENT (from Instant Booking)
  // ============================================================================
  createBooking: publicProcedure
    .input(z.object({
      // Client data
      clientType: z.enum(["INDIVIDUAL", "BUSINESS"]),
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().min(1),
      companyName: z.string().optional(),
      address: z.string().min(1),
      city: z.string().min(1),
      postalCode: z.string().min(1),
      vatNumber: z.string().optional(),
      
      // Event data
      eventDate: z.string(), // ISO date
      eventType: z.string(),
      serviceHours: z.number().min(1),
      location: z.string().optional(),
      staffNeeds: z.array(z.object({
        type: z.string(),
        count: z.number().min(1),
      })),
    }))
    .mutation(async ({ input }) => {
      // 1. Create user
      const userResult = await db.createUser({
        openId: `client-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        name: input.name,
        email: input.email,
        phone: input.phone,
        role: "client",
      });
      const userId = userResult[0].insertId;

      // 2. Create client
      const clientResult = await db.createClient({
        userId,
        companyName: input.companyName,
        address: input.address,
        city: input.city,
        zipCode: input.postalCode,
        notes: input.vatNumber ? `VAT: ${input.vatNumber}` : undefined,
      });
      const clientId = clientResult[0].insertId;

      // 3. Create event
      const eventTitle = `${input.eventType} - ${input.name}`;
      const eventResult = await db.createEvent({
        clientId,
        title: eventTitle,
        description: `Event type: ${input.eventType}\nDuration: ${input.serviceHours} hours\nStaff needs: ${input.staffNeeds.map(s => `${s.count}x ${s.type}`).join(", ")}`,
        status: "quote",
        eventDate: new Date(input.eventDate),
        location: input.location || input.address,
        notes: `Booking from Instant Booking form\nClient type: ${input.clientType}`,
      });
      const eventId = eventResult[0].insertId;

      return {
        success: true,
        eventId,
        clientId,
      };
    }),

  // ============================================================================
  // GET EVENT BY ID
  // ============================================================================
  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const event = await db.getEventById(input.id);
      if (!event) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      }
      return event;
    }),

  // ============================================================================
  // LIST ALL EVENTS
  // ============================================================================
  list: adminProcedure.query(async () => {
    return await db.getAllEvents();
  }),

  // ============================================================================
  // UPDATE EVENT STATUS
  // ============================================================================
  updateStatus: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["quote", "confirmed", "in_progress", "completed", "cancelled"]),
    }))
    .mutation(async ({ input }) => {
      await db.updateEventStatus(input.id, input.status);
      return { success: true };
    }),

  // ============================================================================
  // UPDATE EVENT NOTES
  // ============================================================================
  updateNotes: adminProcedure
    .input(z.object({
      id: z.number(),
      notes: z.string(),
    }))
    .mutation(async ({ input }) => {
      await db.updateEventNotes(input.id, input.notes);
      return { success: true };
    }),

  // ============================================================================
  // ASSIGN STAFF TO EVENT
  // ============================================================================
  assignStaff: adminProcedure
    .input(z.object({
      eventId: z.number(),
      staffId: z.number(),
      role: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const assignmentId = await db.assignStaffToEvent(input.eventId, input.staffId, input.role);
      return { success: true, assignmentId };
    }),

  // ============================================================================
  // REMOVE STAFF FROM EVENT
  // ============================================================================
  removeStaff: adminProcedure
    .input(z.object({
      assignmentId: z.number(),
    }))
    .mutation(async ({ input }) => {
      await db.removeStaffFromEvent(input.assignmentId);
      return { success: true };
    }),

  // ============================================================================
  // ADD SERVICE TO EVENT
  // ============================================================================
  addService: adminProcedure
    .input(z.object({
      eventId: z.number(),
      serviceId: z.number(),
      quantity: z.number().default(1),
      price: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const eventServiceId = await db.addServiceToEvent(
        input.eventId,
        input.serviceId,
        input.quantity,
        input.price
      );
      return { success: true, eventServiceId };
    }),

  // ============================================================================
  // REMOVE SERVICE FROM EVENT
  // ============================================================================
  removeService: adminProcedure
    .input(z.object({
      eventServiceId: z.number(),
    }))
    .mutation(async ({ input }) => {
      await db.removeServiceFromEvent(input.eventServiceId);
      return { success: true };
    }),

  // ============================================================================
  // ADD PARTNER COMPANY TO EVENT
  // ============================================================================
  addPartnerCompany: adminProcedure
    .input(z.object({
      eventId: z.number(),
      partnerCompanyId: z.number(),
      role: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const eventPartnerCompanyId = await db.addPartnerCompanyToEvent(
        input.eventId,
        input.partnerCompanyId,
        input.role,
        input.notes
      );
      return { success: true, eventPartnerCompanyId };
    }),

  // ============================================================================
  // REMOVE PARTNER COMPANY FROM EVENT
  // ============================================================================
  removePartnerCompany: adminProcedure
    .input(z.object({
      eventPartnerCompanyId: z.number(),
    }))
    .mutation(async ({ input }) => {
      await db.removePartnerCompanyFromEvent(input.eventPartnerCompanyId);
      return { success: true };
    }),

  // ============================================================================
  // ADD INVENTORY ITEM TO EVENT
  // ============================================================================
  addInventoryItem: adminProcedure
    .input(z.object({
      eventId: z.number(),
      itemId: z.number(),
      quantity: z.number().min(1),
    }))
    .mutation(async ({ input }) => {
      const inventoryRequestId = await db.addInventoryToEvent(
        input.eventId,
        input.itemId,
        input.quantity
      );
      return { success: true, inventoryRequestId };
    }),

  // ============================================================================
  // REMOVE INVENTORY ITEM FROM EVENT
  // ============================================================================
  removeInventoryItem: adminProcedure
    .input(z.object({
      inventoryRequestId: z.number(),
    }))
    .mutation(async ({ input }) => {
      await db.removeInventoryFromEvent(input.inventoryRequestId);
      return { success: true };
    }),

  // ============================================================================
  // CALCULATE TOTAL PRICE
  // ============================================================================
  calculateTotalPrice: adminProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ input }) => {
      const totalPrice = await db.calculateEventTotalPrice(input.eventId);
      return { totalPrice };
    }),
});
