import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@royalcrew.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createClientContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "client-user",
    email: "client@example.com",
    name: "Client User",
    loginMethod: "manus",
    role: "client",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("services router", () => {
  it("allows public access to list active services", async () => {
    const ctx: TrpcContext = {
      user: undefined,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);
    const services = await caller.services.list();
    
    expect(Array.isArray(services)).toBe(true);
  });

  it("allows public access to featured services", async () => {
    const ctx: TrpcContext = {
      user: undefined,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);
    const services = await caller.services.featured();
    
    expect(Array.isArray(services)).toBe(true);
  });

  it("requires admin role to list all services", async () => {
    const clientCtx = createClientContext();
    const caller = appRouter.createCaller(clientCtx);

    await expect(caller.services.listAll()).rejects.toThrow("Admin access required");
  });

  it("allows admin to list all services", async () => {
    const adminCtx = createAdminContext();
    const caller = appRouter.createCaller(adminCtx);

    const services = await caller.services.listAll();
    expect(Array.isArray(services)).toBe(true);
  });

  it("requires admin role to create service", async () => {
    const clientCtx = createClientContext();
    const caller = appRouter.createCaller(clientCtx);

    await expect(
      caller.services.create({
        slug: "test-service",
        name: "Test Service",
        isActive: true,
        isFeatured: false,
      })
    ).rejects.toThrow("Admin access required");
  });

  it("allows admin to create service", async () => {
    const adminCtx = createAdminContext();
    const caller = appRouter.createCaller(adminCtx);

    const result = await caller.services.create({
      slug: `test-service-${Date.now()}`,
      name: "Test Service",
      description: "Test description",
      isActive: true,
      isFeatured: false,
    });

    expect(result).toEqual({ success: true });
  });

  it("requires admin role to update service", async () => {
    const clientCtx = createClientContext();
    const caller = appRouter.createCaller(clientCtx);

    await expect(
      caller.services.update({
        id: 1,
        name: "Updated Service",
      })
    ).rejects.toThrow("Admin access required");
  });
});

describe("events router", () => {
  it("requires admin role to list all events", async () => {
    const clientCtx = createClientContext();
    const caller = appRouter.createCaller(clientCtx);

    await expect(caller.events.list()).rejects.toThrow("Admin access required");
  });

  it("allows admin to list all events", async () => {
    const adminCtx = createAdminContext();
    const caller = appRouter.createCaller(adminCtx);

    const events = await caller.events.list();
    expect(Array.isArray(events)).toBe(true);
  });

  it("requires admin role to create event", async () => {
    const clientCtx = createClientContext();
    const caller = appRouter.createCaller(clientCtx);

    await expect(
      caller.events.create({
        clientId: 1,
        title: "Test Event",
        eventDate: new Date(),
      })
    ).rejects.toThrow("Admin access required");
  });
});

describe("staff router", () => {
  it("requires admin role to list staff", async () => {
    const clientCtx = createClientContext();
    const caller = appRouter.createCaller(clientCtx);

    await expect(caller.staff.list()).rejects.toThrow("Admin access required");
  });

  it("allows admin to list staff", async () => {
    const adminCtx = createAdminContext();
    const caller = appRouter.createCaller(adminCtx);

    const staff = await caller.staff.list();
    expect(Array.isArray(staff)).toBe(true);
  });
});

describe("clients router", () => {
  it("requires admin role to list clients", async () => {
    const clientCtx = createClientContext();
    const caller = appRouter.createCaller(clientCtx);

    await expect(caller.clients.list()).rejects.toThrow("Admin access required");
  });

  it("allows admin to list clients", async () => {
    const adminCtx = createAdminContext();
    const caller = appRouter.createCaller(adminCtx);

    const clients = await caller.clients.list();
    expect(Array.isArray(clients)).toBe(true);
  });

  it("allows client to view their own profile", async () => {
    const clientCtx = createClientContext();
    const caller = appRouter.createCaller(clientCtx);

    // Should not throw, even if profile doesn't exist yet
    const profile = await caller.clients.myProfile();
    expect(profile === undefined || typeof profile === 'object').toBe(true);
  });

  it("allows client to view their own events", async () => {
    const clientCtx = createClientContext();
    const caller = appRouter.createCaller(clientCtx);

    const events = await caller.clients.myEvents();
    expect(Array.isArray(events)).toBe(true);
  });
});
