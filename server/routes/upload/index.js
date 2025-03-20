import express from 'express';
import processUploadImage from './ProcessUploadImage.js';
import { processImage } from './processImage.js';

const router = express.Router();

console.log("Upload route initialized"); // ✅ Debugging

router.post("/images", processUploadImage().array("files", 10), async (req, res) => {
    console.log("Multer processed files:", req.files); // ✅ Debugging

    if (!req.files || req.files.length === 0) {
        console.error("No files received");
        return res.status(400).json({ error: "No files uploaded" });
    }

    for (const file of req.files) {
        await processImage(file.buffer, file.originalname.replace(/\.[^/.]+$/, ""));
    }

    res.json({ success: "Files uploaded successfully", files: req.files });
});

export default router;
