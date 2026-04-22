import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { adminProcedure } from "../_core/adminProcedure";
import { getDb } from "../db";
import { staffMembers, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { storagePut } from "../storage";

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
        county: z.string().optional(),
        postcode: z.string().optional(),
        bio: z.string().optional(),
        experience: z.string().optional(),
        specialties: z.array(z.string()),
        hourlyRate: z.string().optional(),
        photoBase64: z.string().optional(), // base64 da foto do candidato
        photoMimeType: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        // Criar usuário temporário para o candidato
        const newUserResult = await db.insert(users).values({
          openId: `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          name: input.name,
          email: input.email,
          role: "staff",
        });

        const userId = (newUserResult[0] as any).insertId;

        // Upload da foto se fornecida
        let profileImageUrl: string | null = null;
        if (input.photoBase64 && input.photoMimeType) {
          try {
            const base64Data = input.photoBase64.replace(/^data:[^;]+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const ext = input.photoMimeType.split('/')[1] || 'jpg';
            const fileKey = `applications/${userId}-photo-${Date.now()}.${ext}`;
            const { url } = await storagePut(fileKey, buffer, input.photoMimeType);
            profileImageUrl = url;
          } catch (photoError) {
            console.error('Error uploading photo:', photoError);
            // Não bloqueia a candidatura se a foto falhar
          }
        }

        // Criar perfil de staff com status "pending"
        await db.insert(staffMembers).values({
          userId: userId,
          specialties: input.specialties,
          hourlyRate: input.hourlyRate ? input.hourlyRate : null,
          bio: input.bio || null,
          experience: input.experience || null,
          profileImage: profileImageUrl,
          phone: input.phone,
          address: input.address || null,
          city: input.city || null,
          county: input.county || null,
          postcode: input.postcode || null,
          status: "pending",
          rating: "0.00",
          totalEvents: 0,
          isActive: false, // Inativo até aprovação
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
        profileImage: staffMembers.profileImage,
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

  // Admin: Apagar candidatura
  deleteApplication: adminProcedure
    .input(z.object({ staffId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(staffMembers).where(eq(staffMembers.id, input.staffId));
      return { success: true };
    }),
});
