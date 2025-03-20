import multer from "multer";

function processUploadImage() {
    return multer({
        storage: multer.memoryStorage(),
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.startsWith("image/")) return cb(new Error("Only image files allowed"), false);
            cb(null, true);
        }
    });
}

export default processUploadImage;

