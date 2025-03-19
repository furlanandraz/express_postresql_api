import expres from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

import Media from '#DAO/Media.js';
import UploadHandler from './UploadHandler.js';

const router = expres.Router();

router.post("/images", UploadHandler.Image.array("files", 10), async (req, res) => {
    try {

        const tags = JSON.parse(req.body.tags) || [];
        
        console.log(typeof (tags), tags);
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        const filePaths = req.files.map(file => ({
            originalName: file.originalname,
            storedName: file.filename,
            path: `/static/uploads/images/${file.filename}`
        }));

        await Media.insertImages(filePaths.map(file => file.path), tags);

        res.json({ success: "Files uploaded successfully", files: filePaths, tags });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


export default router;