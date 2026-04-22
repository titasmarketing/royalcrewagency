import { describe, it, expect } from "vitest";
import { storagePut, storageGet, storageDelete } from "./storage";

describe("Cloudflare R2 Storage", () => {
  const testKey = `test/vitest-check-${Date.now()}.txt`;
  const testContent = "Royal Crew R2 storage test";

  it("should upload a text file to R2", async () => {
    const result = await storagePut(testKey, testContent, "text/plain");
    expect(result.key).toBe(testKey);
    expect(result.url).toContain(testKey);
    console.log("✅ Upload URL:", result.url);
  }, 30000);

  it("should generate a presigned GET URL", async () => {
    const result = await storageGet(testKey, 60);
    expect(result.key).toBe(testKey);
    expect(result.url).toBeTruthy();
    console.log("✅ Presigned URL:", result.url.substring(0, 80) + "...");
  }, 30000);

  it("should delete the test file from R2", async () => {
    await expect(storageDelete(testKey)).resolves.not.toThrow();
    console.log("✅ File deleted successfully");
  }, 30000);
});
