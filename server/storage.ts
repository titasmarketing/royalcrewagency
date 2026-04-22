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

function getR2Client(): S3Client {
  if (!ENV.r2Endpoint || !ENV.r2AccessKeyId || !ENV.r2SecretAccessKey) {
    throw new Error(
      "R2 credentials missing: set R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY"
    );
  }
  return new S3Client({
    region: "auto",
    endpoint: ENV.r2Endpoint,
    credentials: {
      accessKeyId: ENV.r2AccessKeyId,
      secretAccessKey: ENV.r2SecretAccessKey,
    },
  });
}

function getBucketName(): string {
  if (!ENV.r2BucketName) throw new Error("R2_BUCKET_NAME is not set");
  return ENV.r2BucketName;
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

/**
 * Build the public URL for a stored object.
 * If R2_PUBLIC_URL is set (custom domain), use it; otherwise construct from endpoint.
 */
function buildPublicUrl(key: string): string {
  const base = ENV.r2PublicUrl || ENV.r2Endpoint;
  return `${base.replace(/\/+$/, "")}/${key}`;
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
