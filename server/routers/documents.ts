import { z } from "zod";
import { router } from "../_core/trpc";
import { adminProcedure } from "../_core/adminProcedure";
import { protectedProcedure } from "../_core/trpc";
import { generateContract, generateServiceOrder, generateInvoice } from "../pdfGenerator";
import * as db from "../db";
import { TRPCError } from "@trpc/server";
import { format } from "date-fns";

export const documentsRouter = router({
  // ============================================================================
  // ADMIN: Generate contract from real event data (auto-fill)
  // ============================================================================
  generateContractFromEvent: adminProcedure
    .input(z.object({ eventId: z.number() }))
    .mutation(async ({ input }) => {
      const event = await db.getEventById(input.eventId);
      if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });

      const eventServices = await db.getEventServices(input.eventId);
      const serviceNames = eventServices.length > 0
        ? eventServices.map((s) => s.serviceName || "Service").filter(Boolean) as string[]
        : ["Event organisation and execution", "Full team provision", "Materials and equipment"];

      const clientName = (event.client as any)?.name || (event.client as any)?.companyName || "Client";
      const clientDoc = (event.client as any)?.document || "—";

      const pdfBuffer = await generateContract({
        eventTitle: event.title,
        eventDate: format(new Date(event.eventDate), "dd/MM/yyyy"),
        clientName,
        clientDocument: clientDoc,
        location: event.location || "To be confirmed",
        totalPrice: event.totalPrice ? parseFloat(event.totalPrice).toFixed(2) : "0.00",
        services: serviceNames,
      });

      return {
        success: true,
        pdf: pdfBuffer.toString("base64"),
        filename: `contract_${event.title.replace(/\s+/g, "_")}_${Date.now()}.pdf`,
      };
    }),

  // ============================================================================
  // ADMIN: Generate service order from real event data (auto-fill)
  // ============================================================================
  generateServiceOrderFromEvent: adminProcedure
    .input(z.object({ eventId: z.number() }))
    .mutation(async ({ input }) => {
      const event = await db.getEventById(input.eventId);
      if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });

      const inventoryReqs = await db.getEventInventory(input.eventId);

      const staffList = ((event as any).staffAssignments || []).map((sa: any) => ({
        name: sa.staff?.name || `Staff #${sa.staffId}`,
        role: sa.role || "Staff",
        startTime: (event as any).startTime || "—",
        endTime: (event as any).endTime || "—",
      }));

      const inventoryItems = inventoryReqs.map((ir: any) => ({
        name: `Item #${ir.itemId}`,
        quantity: ir.quantityRequested,
        unit: "unit",
      }));

      const pdfBuffer = await generateServiceOrder({
        eventTitle: event.title,
        eventDate: format(new Date(event.eventDate), "dd/MM/yyyy"),
        location: event.location || "To be confirmed",
        staffMembers: staffList,
        inventoryItems,
      });

      return {
        success: true,
        pdf: pdfBuffer.toString("base64"),
        filename: `service_order_${event.title.replace(/\s+/g, "_")}_${Date.now()}.pdf`,
      };
    }),

  // ============================================================================
  // ADMIN: Generate invoice from real event data (auto-fill)
  // ============================================================================
  generateInvoiceFromEvent: adminProcedure
    .input(z.object({ eventId: z.number() }))
    .mutation(async ({ input }) => {
      const event = await db.getEventById(input.eventId);
      if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });

      const eventServices = await db.getEventServices(input.eventId);
      const clientName = (event.client as any)?.name || (event.client as any)?.companyName || "Client";
      const clientDoc = (event.client as any)?.document || "—";

      let services;
      if (eventServices.length > 0) {
        services = eventServices.map((s) => {
          const price = s.servicePrice ? parseFloat(s.servicePrice).toFixed(2) : "0.00";
          return { description: s.serviceName || "Service", quantity: 1, unitPrice: price, total: price };
        });
      } else {
        const price = event.totalPrice ? parseFloat(event.totalPrice).toFixed(2) : "0.00";
        services = [{ description: "Event organisation and execution", quantity: 1, unitPrice: price, total: price }];
      }

      const subtotal = services.reduce((sum, s) => sum + parseFloat(s.total), 0);
      const taxes = subtotal * 0.2;
      const total = subtotal + taxes;
      const invoiceNumber = `INV-${event.id}-${Date.now()}`;

      const pdfBuffer = await generateInvoice({
        invoiceNumber,
        eventTitle: event.title,
        clientName,
        clientDocument: clientDoc,
        services,
        subtotal: subtotal.toFixed(2),
        taxes: taxes.toFixed(2),
        total: total.toFixed(2),
      });

      return {
        success: true,
        pdf: pdfBuffer.toString("base64"),
        filename: `invoice_${invoiceNumber}.pdf`,
      };
    }),

  // ============================================================================
  // CLIENT: Download own invoice
  // ============================================================================
  clientDownloadInvoice: protectedProcedure
    .input(z.object({ eventId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const client = await db.getClientByUserId(ctx.user.id);
      if (!client) throw new TRPCError({ code: "FORBIDDEN", message: "Client profile not found" });

      const event = await db.getEventById(input.eventId);
      if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      if (event.clientId !== client.id) throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });

      const eventServices = await db.getEventServices(input.eventId);
      const clientName = (event.client as any)?.name || (event.client as any)?.companyName || ctx.user.name || "Client";
      const clientDoc = (event.client as any)?.document || "—";

      let services;
      if (eventServices.length > 0) {
        services = eventServices.map((s) => {
          const price = s.servicePrice ? parseFloat(s.servicePrice).toFixed(2) : "0.00";
          return { description: s.serviceName || "Service", quantity: 1, unitPrice: price, total: price };
        });
      } else {
        const price = event.totalPrice ? parseFloat(event.totalPrice).toFixed(2) : "0.00";
        services = [{ description: "Event organisation and execution", quantity: 1, unitPrice: price, total: price }];
      }

      const subtotal = services.reduce((sum, s) => sum + parseFloat(s.total), 0);
      const taxes = subtotal * 0.2;
      const total = subtotal + taxes;
      const invoiceNumber = `INV-${event.id}-${Date.now()}`;

      const pdfBuffer = await generateInvoice({
        invoiceNumber,
        eventTitle: event.title,
        clientName,
        clientDocument: clientDoc,
        services,
        subtotal: subtotal.toFixed(2),
        taxes: taxes.toFixed(2),
        total: total.toFixed(2),
      });

      return {
        success: true,
        pdf: pdfBuffer.toString("base64"),
        filename: `invoice_${invoiceNumber}.pdf`,
      };
    }),

  // ============================================================================
  // LEGACY: Manual input procedures (kept for backwards compatibility)
  // ============================================================================
  generateContract: adminProcedure
    .input(z.object({
      eventTitle: z.string(), eventDate: z.string(), clientName: z.string(),
      clientDocument: z.string(), location: z.string(), totalPrice: z.string(),
      services: z.array(z.string()),
    }))
    .mutation(async ({ input }) => {
      const pdfBuffer = await generateContract(input);
      return { success: true, pdf: pdfBuffer.toString("base64"), filename: `contract_${input.eventTitle.replace(/\s+/g, "_")}_${Date.now()}.pdf` };
    }),

  generateServiceOrder: adminProcedure
    .input(z.object({
      eventTitle: z.string(), eventDate: z.string(), location: z.string(),
      staffMembers: z.array(z.object({ name: z.string(), role: z.string(), startTime: z.string(), endTime: z.string() })),
      inventoryItems: z.array(z.object({ name: z.string(), quantity: z.number(), unit: z.string() })),
    }))
    .mutation(async ({ input }) => {
      const pdfBuffer = await generateServiceOrder(input);
      return { success: true, pdf: pdfBuffer.toString("base64"), filename: `service_order_${input.eventTitle.replace(/\s+/g, "_")}_${Date.now()}.pdf` };
    }),

  generateInvoice: adminProcedure
    .input(z.object({
      invoiceNumber: z.string(), eventTitle: z.string(), clientName: z.string(), clientDocument: z.string(),
      services: z.array(z.object({ description: z.string(), quantity: z.number(), unitPrice: z.string(), total: z.string() })),
      subtotal: z.string(), taxes: z.string(), total: z.string(),
    }))
    .mutation(async ({ input }) => {
      const pdfBuffer = await generateInvoice(input);
      return { success: true, pdf: pdfBuffer.toString("base64"), filename: `invoice_${input.invoiceNumber}_${Date.now()}.pdf` };
    }),
});
