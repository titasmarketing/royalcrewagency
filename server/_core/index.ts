import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
// OAuth removed - using JWT authentication
import { appRouter } from "../routers";
import { createContext } from "./context-jwt";
import uploadRouter from "../upload";
import { serveStatic, setupVite } from "./vite";
import { registerStorageProxy } from "./storageProxy";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cookieParser());
  // OAuth removed - using JWT authentication
  // Storage proxy for manus-storage assets
  registerStorageProxy(app);
  // Upload API
  app.use("/api", uploadRouter);
  // DB test endpoint
  app.get('/api/db-test', async (req, res) => {
    const mysql2 = await import('mysql2/promise');
    try {
      const conn = await mysql2.createConnection({
        host: '127.0.0.1',
        port: 3306,
        user: 'u219024948_reginaldo',
        password: 'Pagotto24',
        database: 'u219024948_reginaldo',
      });
      const [rows] = await conn.execute('SELECT COUNT(*) as total FROM users');
      await conn.end();
      res.json({ ok: true, rows });
    } catch (err: any) {
      res.json({ ok: false, error: err.message, code: err.code });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
