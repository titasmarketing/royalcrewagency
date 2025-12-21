import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { adminProcedure } from "../_core/adminProcedure";
import { getDb } from "../db";
import { staffMembers, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { notifyOwner } from "../_core/notification";

export const recruitmentRouter = router({
  // Public procedure para criar candidatura
  createApplication: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),

        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        bio: z.string().optional(),
        experience: z.string().optional(),
        specialties: z.array(z.string()),
        hourlyRate: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        // Criar usuário temporário para o candidato
        const [newUser] = await db.insert(users).values({
          openId: `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          name: input.name,
          email: input.email,
          role: "staff",
        });

        const userId = newUser.insertId;

        // Criar perfil de staff com status "pending"
        await db.insert(staffMembers).values({
          userId: userId,
          specialties: input.specialties,
          hourlyRate: input.hourlyRate ? input.hourlyRate : null,
          bio: input.bio || null,
          experience: input.experience || null,
  
          phone: input.phone,
          address: input.address || null,
          city: input.city || null,
          state: input.state || null,
          status: "pending",
          rating: "0.00",
          totalEvents: 0,
          isActive: false, // Inativo até aprovação
        });

        // Notificar admin sobre nova candidatura
        await notifyOwner({
          title: "Nova Candidatura Recebida",
          content: `${input.name} (${input.email}) se candidatou para fazer parte da equipe. Especialidades: ${input.specialties.join(", ")}`,
        });

        return {
          success: true,
          message: "Candidatura enviada com sucesso!",
        };
      } catch (error) {
        console.error("Error creating application:", error);
        throw new Error("Erro ao criar candidatura");
      }
    }),

  // Admin: Listar candidaturas pendentes
  listPendingApplications: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    const applications = await db
      .select({
        id: staffMembers.id,
        name: users.name,
        email: users.email,
        phone: staffMembers.phone,
        specialties: staffMembers.specialties,
        experience: staffMembers.experience,
        bio: staffMembers.bio,
        hourlyRate: staffMembers.hourlyRate,
        status: staffMembers.status,
        createdAt: staffMembers.createdAt,
      })
      .from(staffMembers)
      .leftJoin(users, eq(staffMembers.userId, users.id))
      .where(eq(staffMembers.status, "pending"));

    return applications;
  }),

  // Admin: Aprovar candidatura
  approveApplication: adminProcedure
    .input(z.object({ staffId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      await db
        .update(staffMembers)
        .set({
          status: "approved",
          isActive: true,
        })
        .where(eq(staffMembers.id, input.staffId));

      return {
        success: true,
        message: "Candidatura aprovada com sucesso!",
      };
    }),

  // Admin: Rejeitar candidatura
  rejectApplication: adminProcedure
    .input(z.object({ staffId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      await db
        .update(staffMembers)
        .set({
          status: "rejected",
          isActive: false,
        })
        .where(eq(staffMembers.id, input.staffId));

      return {
        success: true,
        message: "Candidatura rejeitada.",
      };
    }),
});
