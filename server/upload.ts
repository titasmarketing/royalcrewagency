import { Router } from "express";
import multer from "multer";
import { storagePut } from "./storage";

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const ext = req.file.originalname.split(".").pop();
    const fileKey = `gallery/${timestamp}-${randomStr}.${ext}`;

    // Upload to S3
    const result = await storagePut(fileKey, req.file.buffer, req.file.mimetype);

    res.json({
      url: result.url,
      key: fileKey,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message || "Upload failed" });
  }
});

export default router;
