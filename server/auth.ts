import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import * as db from "./db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export const authRouter = router({
  // Register new user
  register: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(2),
      role: z.enum(["admin", "client", "staff"]).default("client"),
    }))
    .mutation(async ({ input }) => {
      // Check if user already exists
      const existing = await db.getUserByEmail(input.email);
      if (existing) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // Create user
      const user = await db.createUser({
        email: input.email,
        password: hashedPassword,
        name: input.name,
        role: input.role,
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      };
    }),

  // Login
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Find user
      const user = await db.getUserByEmail(input.email);
      if (!user || !user.password) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
      }

      // Verify password
      const valid = await bcrypt.compare(input.password, user.password);
      if (!valid) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      };
    }),

  // Get current user
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),

  // Logout (client-side clears token)
  logout: protectedProcedure.mutation(() => {
    return { success: true };
  }),
});
