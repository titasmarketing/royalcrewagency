// Cloudflare R2 Storage (S3-compatible)
// Uses @aws-sdk/client-s3 with R2 credentials from environment variables

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ENV } from "./_core/env";

// Cloudflare R2 credentials (royalcrew bucket)
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY_ID || "e36967551400898fac9d37f5ec92972b";
const R2_SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY || "998c12dee0ac02bb81019a3fffae3e26682d6dfb34f0d13e009db74b1da64b15";
const R2_ENDPOINT_URL = process.env.R2_ENDPOINT || "https://023a0bad3f17632316cd10358db2201f.r2.cloudflarestorage.com";
const R2_BUCKET = process.env.R2_BUCKET_NAME || "royalcrew";
const R2_PUBLIC_BASE = process.env.R2_PUBLIC_URL || "https://dados.royalcrewagency.com";

function getR2Client(): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: R2_ENDPOINT_URL,
    credentials: {
      accessKeyId: R2_ACCESS_KEY,
      secretAccessKey: R2_SECRET_KEY,
    },
  });
}

function getBucketName(): string {
  return R2_BUCKET;
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function buildPublicUrl(key: string): string {
  return `${R2_PUBLIC_BASE.replace(/\/+$/, "")}/${key}`;
}

/**
 * Upload data to R2 and return the public URL.
 */
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const client = getR2Client();
  const bucket = getBucketName();
  const key = normalizeKey(relKey);

  const body =
    typeof data === "string" ? Buffer.from(data, "utf-8") : Buffer.from(data);

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  return { key, url: buildPublicUrl(key) };
}

/**
 * Get a presigned GET URL for a private object (expires in 1 hour by default).
 */
export async function storageGet(
  relKey: string,
  expiresIn = 3600
): Promise<{ key: string; url: string }> {
  const client = getR2Client();
  const bucket = getBucketName();
  const key = normalizeKey(relKey);

  const url = await getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn }
  );

  return { key, url };
}

/**
 * Delete an object from R2.
 */
export async function storageDelete(relKey: string): Promise<void> {
  const client = getR2Client();
  const bucket = getBucketName();
  const key = normalizeKey(relKey);

  await client.send(
    new DeleteObjectCommand({ Bucket: bucket, Key: key })
  );
}
