import fs from "fs";
import path from "path";
import multer from "multer";


const uploadDir = path.join("uploads", "avatars");  // Configure folder where images are downloaded

// Multer-middleware to upload profile pictures

export const uploadAvatar = multer({
    storage: multer.diskStorage({   // Configure disk storage
        destination: (_req, _file, cb) => { // Folder destination for files 
            fs.mkdirSync(uploadDir, { recursive: true });   // Folder is created if not found
            cb(null, uploadDir);
        },
        filename: (req: any, file, cb) => { // Configure filename
            const userId = req.auth?.sub;   // User's auth0_id from auth middleware
            if (!userId) {
                return cb(new Error("Missing auth"), "");
            }
            // Auth0_id is parsed for filename
            const safeUserId = String(userId).replace(/[<>:"/\\|?*]/g, "_");
            // file's extension is separated, or defaul ".jpg" is used
            const extFromName = path.extname(file.originalname).toLowerCase();
            const ext = extFromName || ".jpg";
            cb(null, `avatar_${safeUserId}${ext}`);
        },
    }),
    // Limit file size to 10MB (DB and upload reasons)
    limits: { fileSize: 10 * 1024 * 1024 },
    // Only images are approved
    fileFilter: (_, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(null, false);
        }
        cb(null, true);
    },
});