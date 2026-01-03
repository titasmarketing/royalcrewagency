import { router, protectedProcedure } from "../_core/trpc";
import { adminProcedure } from "../_core/adminProcedure";
import { z } from "zod";
import * as db from "../db";
import { TRPCError } from "@trpc/server";

export const staffRouter = router({
  // ============================================================================
  // MY JOBS - Lista apenas eventos onde staff foi assigned
  // ============================================================================
  myJobs: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== 'staff') {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Staff access required' });
    }
    const staff = await db.getStaffByUserId(ctx.user.id);
    if (!staff) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Staff profile not found' });
    }
    return await db.getStaffAssignedEvents(staff.id);
  }),

  // ============================================================================
  // ACCEPT JOB - Staff aceita o job
  // ============================================================================
  acceptJob: protectedProcedure
    .input(z.object({
      assignmentId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'staff') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Staff access required' });
      }
      await db.updateStaffAssignmentStatus(input.assignmentId, 'accepted');
      return { success: true, message: 'Job accepted successfully!' };
    }),

  // ============================================================================
  // DECLINE JOB - Staff recusa o job
  // ============================================================================
  declineJob: protectedProcedure
    .input(z.object({
      assignmentId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'staff') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Staff access required' });
      }
      await db.updateStaffAssignmentStatus(input.assignmentId, 'declined');
      return { success: true, message: 'Job declined' };
    }),

  // ============================================================================
  // CHECK IN - Staff faz check-in no evento com GPS
  // ============================================================================
  checkIn: protectedProcedure
    .input(z.object({
      assignmentId: z.number(),
      location: z.object({
        lat: z.number(),
        lng: z.number(),
        address: z.string().optional(),
      }),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'staff') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Staff access required' });
      }
      await db.staffCheckIn(input.assignmentId, input.location);
      return { success: true, message: 'Checked in successfully!' };
    }),

  // ============================================================================
  // CHECK OUT - Staff faz check-out do evento com GPS
  // ============================================================================
  checkOut: protectedProcedure
    .input(z.object({
      assignmentId: z.number(),
      location: z.object({
        lat: z.number(),
        lng: z.number(),
        address: z.string().optional(),
      }),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'staff') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Staff access required' });
      }
      await db.staffCheckOut(input.assignmentId, input.location);
      return { success: true, message: 'Checked out successfully!' };
    }),

  // ============================================================================
  // SEND MESSAGE - Staff envia mensagem para admin
  // ============================================================================
  sendMessage: protectedProcedure
    .input(z.object({
      eventId: z.number().optional(),
      message: z.string().min(1),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'staff') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Staff access required' });
      }
      const staff = await db.getStaffByUserId(ctx.user.id);
      if (!staff) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Staff profile not found' });
      }
      await db.createStaffMessage({
        staffId: staff.id,
        eventId: input.eventId,
        senderId: ctx.user.id,
        senderRole: 'staff',
        message: input.message,
      });
      return { success: true, message: 'Message sent!' };
    }),

  // ============================================================================
  // GET MESSAGES - Busca histórico de mensagens
  // ============================================================================
  getMessages: protectedProcedure
    .input(z.object({
      eventId: z.number().optional(),
    }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'staff') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Staff access required' });
      }
      const staff = await db.getStaffByUserId(ctx.user.id);
      if (!staff) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Staff profile not found' });
      }
      return await db.getStaffMessages(staff.id, input.eventId);
    }),

  // ============================================================================
  // UPLOAD PHOTO - Staff faz upload de foto
  // ============================================================================
  uploadPhoto: protectedProcedure
    .input(z.object({
      eventId: z.number(), // Evento ao qual a foto pertence
      photoData: z.string(), // base64
      fileName: z.string(),
      caption: z.string().optional(), // Descrição da foto
      isPrimary: z.boolean().default(false),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'staff') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Staff access required' });
      }
      const staff = await db.getStaffByUserId(ctx.user.id);
      if (!staff) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Staff profile not found' });
      }
      
      // Convert base64 to buffer
      const base64Data = input.photoData.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Upload to S3
      const { storagePut } = await import('../storage');
      const fileKey = `staff/${staff.id}/photos/${Date.now()}-${input.fileName}`;
      const { url } = await storagePut(fileKey, buffer, 'image/jpeg');
      
      await db.createStaffPhoto({
        staffId: staff.id,
        eventId: input.eventId,
        photoUrl: url,
        photoKey: fileKey,
        caption: input.caption,
        isPrimary: input.isPrimary,
      });
      return { success: true, message: 'Photo uploaded!', url };
    }),

  // ============================================================================
  // GET PHOTOS - Busca fotos do staff (filtradas por evento)
  // ============================================================================
  getPhotos: protectedProcedure
    .input(z.object({
      eventId: z.number().optional(), // Filtrar por evento específico
    }).optional())
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'staff') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Staff access required' });
      }
      const staff = await db.getStaffByUserId(ctx.user.id);
      if (!staff) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Staff profile not found' });
      }
      return await db.getStaffPhotos(staff.id, input?.eventId);
    }),

  // ============================================================================
  // DELETE PHOTO - Remove foto
  // ============================================================================
  deletePhoto: protectedProcedure
    .input(z.object({
      photoId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'staff') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Staff access required' });
      }
      await db.deleteStaffPhoto(input.photoId);
      return { success: true, message: 'Photo deleted!' };
    }),

  // ============================================================================
  // GET EVENT PHOTOS - Admin busca fotos de um evento (todas as fotos de todos os staff)
  // ============================================================================
  getEventPhotos: adminProcedure
    .input(z.object({
      eventId: z.number(),
    }))
    .query(async ({ input }) => {
      const dbModule = await import('../db');
      return await dbModule.getEventPhotos(input.eventId);
    }),
});
