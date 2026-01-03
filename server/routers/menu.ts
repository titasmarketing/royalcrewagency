import { z } from "zod";
import { publicProcedure, protectedProcedure, router, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { menuItems, eventMenuSelections } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

export const menuRouter = router({
  // Public: List all active menu items
  list: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return await db.select().from(menuItems).where(eq(menuItems.isActive, true)).orderBy(menuItems.displayOrder, menuItems.category);
  }),

  // Admin: List all menu items (including inactive)
  listAll: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return await db.select().from(menuItems).orderBy(menuItems.category, menuItems.displayOrder);
  }),

  // Admin: Create menu item
  create: adminProcedure
    .input(z.object({
      category: z.enum(["Starters", "Main Course", "Desserts", "Beverages", "Other"]),
      name: z.string(),
      description: z.string().optional(),
      ingredients: z.string().optional(),
      imageUrl: z.string().optional(),
      imageKey: z.string().optional(),
      displayOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const [item] = await db.insert(menuItems).values(input);
      return { success: true, itemId: item.insertId };
    }),

  // Admin: Update menu item
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      category: z.enum(["Starters", "Main Course", "Desserts", "Beverages", "Other"]).optional(),
      name: z.string().optional(),
      description: z.string().optional(),
      ingredients: z.string().optional(),
      imageUrl: z.string().optional(),
      imageKey: z.string().optional(),
      displayOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...data} = input;
      await db.update(menuItems).set(data).where(eq(menuItems.id, id));
      return { success: true };
    }),

  // Admin: Delete menu item
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(menuItems).where(eq(menuItems.id, input.id));
      return { success: true };
    }),

  // Protected: Add menu selection to event
  addToEvent: protectedProcedure
    .input(z.object({
      eventId: z.number(),
      menuItemId: z.number(),
      quantity: z.number().default(1),
      price: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.insert(eventMenuSelections).values(input);
      return { success: true };
    }),

  // Protected: Remove menu selection from event
  removeFromEvent: protectedProcedure
    .input(z.object({
      eventId: z.number(),
      menuItemId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(eventMenuSelections).where(
        and(
          eq(eventMenuSelections.eventId, input.eventId),
          eq(eventMenuSelections.menuItemId, input.menuItemId)
        )
      );
      return { success: true };
    }),

  // Public: Get menu selections for an event
  getEventMenu: publicProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const selections = await db
        .select()
        .from(eventMenuSelections)
        .where(eq(eventMenuSelections.eventId, input.eventId));
      
      if (selections.length === 0) return [];
      
      // Fetch all menu items for these selections
      const itemIds = selections.map((s: any) => s.menuItemId);
      const items = await db.select().from(menuItems);
      
      return selections.map((sel: any) => {
        const item = items.find((i: any) => i.id === sel.menuItemId);
        return {
          ...sel,
          menuItem: item,
        };
      });
    }),
});
