import multer from "multer";
import path from "path";

class UploadHandler {

    static #imagePath = path.join(process.cwd(), "static", "images");
    
    static #storageImage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, UploadHandler.#imagePath),
        filename: (req, file, cb) => cb(null, file.originalname),
    });

    static get Image() {
        return multer({
            storage: UploadHandler.#storageImage,
            limits: { fileSize: 10 * 1024 * 1024 },
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.startsWith("image/")) return cb(new Error("Only image files allowed"), false);
                cb(null, true);
            }
        });
    }

}

export default UploadHandler;
