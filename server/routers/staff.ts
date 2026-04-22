import { router, protectedProcedure } from "../_core/trpc";
import { adminProcedure } from "../_core/adminProcedure";
import { z } from "zod";
import * as db from "../db";
import { TRPCError } from "@trpc/server";

// Haversine formula para calcular distância entre duas coordenadas GPS
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distância em km
}

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
      
      // Buscar localização do evento
      const assignment = await db.getStaffAssignmentById(input.assignmentId);
      if (!assignment) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Assignment not found' });
      }
      
      const event = await db.getEventById(assignment.eventId);
      if (!event) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' });
      }
      
      // Validar proximidade GPS (500m de raio)
      if (event.latitude && event.longitude) {
        const distance = calculateDistance(
          input.location.lat,
          input.location.lng,
          Number(event.latitude),
          Number(event.longitude)
        );
        
        const MAX_DISTANCE_KM = 0.5; // 500 metros
        if (distance > MAX_DISTANCE_KM) {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: `You must be within 500m of the event location to check in. You are ${(distance * 1000).toFixed(0)}m away.` 
          });
        }
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

  // ============================================================================
  // GET EVENT MESSAGES - Admin busca mensagens de um evento (com nome do staff)
  // ============================================================================
  getEventMessages: adminProcedure
    .input(z.object({
      eventId: z.number(),
    }))
    .query(async ({ input }) => {
      const dbModule = await import('../db');
      return await dbModule.getEventMessages(input.eventId);
    }),

  // ============================================================================
  // GET STAFF ASSIGNMENTS - Admin busca assignments de um evento com GPS
  // ============================================================================
  getStaffAssignments: adminProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ input }) => {
      const dbModule = await import('../db');
      return await dbModule.getEventStaffAssignments(input.eventId);
    }),

  // ============================================================================
  // UPDATE LOCATION - Staff partilha localização GPS em tempo real
  // ============================================================================
  updateLocation: protectedProcedure
    .input(z.object({
      latitude: z.number(),
      longitude: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'staff') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Staff access required' });
      }
      await db.updateStaffLocation(ctx.user.id, input.latitude, input.longitude);
      return { success: true };
    }),

  // ============================================================================
  // GET ALL STAFF LOCATIONS - Admin vê localização de todos os staff activos
  // ============================================================================
  getAllLocations: adminProcedure
    .query(async () => {
      return await db.getActiveStaffLocations();
    }),
});

