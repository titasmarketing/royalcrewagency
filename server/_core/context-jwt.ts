import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateExpressContextOptions } from "@trpc/server/adapters/express";
import jwt from "jsonwebtoken";
import * as db from "../db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function createContext({ req, res }: CreateExpressContextOptions) {
  // Try to get token from Authorization header or cookie
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") 
    ? authHeader.substring(7) 
    : req.cookies?.auth_token;

  let user = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; role: string };
      user = await db.getUserById(decoded.userId);
    } catch (error) {
      // Token invalid or expired, user stays null
      console.log("JWT verification failed:", error);
    }
  }

  return {
    req,
    res,
    user,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
