import { z } from "zod";
import { router } from "../_core/trpc";
import { adminProcedure } from "../_core/adminProcedure";
import { generateContract, generateServiceOrder, generateInvoice } from "../pdfGenerator";

export const documentsRouter = router({
  generateContract: adminProcedure
    .input(
      z.object({
        eventTitle: z.string(),
        eventDate: z.string(),
        clientName: z.string(),
        clientDocument: z.string(),
        location: z.string(),
        totalPrice: z.string(),
        services: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const pdfBuffer = await generateContract(input);
      // Convert buffer to base64 for transmission
      const base64 = pdfBuffer.toString("base64");
      return {
        success: true,
        pdf: base64,
        filename: `contrato_${input.eventTitle.replace(/\s+/g, "_")}_${Date.now()}.pdf`,
      };
    }),

  generateServiceOrder: adminProcedure
    .input(
      z.object({
        eventTitle: z.string(),
        eventDate: z.string(),
        location: z.string(),
        staffMembers: z.array(
          z.object({
            name: z.string(),
            role: z.string(),
            startTime: z.string(),
            endTime: z.string(),
          })
        ),
        inventoryItems: z.array(
          z.object({
            name: z.string(),
            quantity: z.number(),
            unit: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const pdfBuffer = await generateServiceOrder(input);
      const base64 = pdfBuffer.toString("base64");
      return {
        success: true,
        pdf: base64,
        filename: `ordem_servico_${input.eventTitle.replace(/\s+/g, "_")}_${Date.now()}.pdf`,
      };
    }),

  generateInvoice: adminProcedure
    .input(
      z.object({
        invoiceNumber: z.string(),
        eventTitle: z.string(),
        clientName: z.string(),
        clientDocument: z.string(),
        services: z.array(
          z.object({
            description: z.string(),
            quantity: z.number(),
            unitPrice: z.string(),
            total: z.string(),
          })
        ),
        subtotal: z.string(),
        taxes: z.string(),
        total: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const pdfBuffer = await generateInvoice(input);
      const base64 = pdfBuffer.toString("base64");
      return {
        success: true,
        pdf: base64,
        filename: `nota_fiscal_${input.invoiceNumber}_${Date.now()}.pdf`,
      };
    }),
});
