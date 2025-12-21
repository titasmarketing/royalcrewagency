import { z } from "zod";
import { router } from "../_core/trpc";
import { adminProcedure } from "../_core/adminProcedure";
import * as db from "../db";

export const inventoryRouter = router({
  list: adminProcedure.query(async () => {
    return await db.getAllInventoryItems();
  }),

  lowStock: adminProcedure.query(async () => {
    return await db.getLowStockItems();
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        category: z.string().optional(),
        unit: z.string(),
        currentStock: z.string(),
        minStock: z.string(),
        unitCost: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await db.createInventoryItem({
        name: input.name,
        category: input.category || null,
        unit: input.unit,
        currentStock: parseInt(input.currentStock),
        minStock: parseInt(input.minStock),
        unitCost: input.unitCost || null,
      });
      return { success: true };
    }),

  updateStock: adminProcedure
    .input(
      z.object({
        id: z.number(),
        currentStock: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // TODO: Implement update inventory item stock
      return { success: true };
    }),
});
