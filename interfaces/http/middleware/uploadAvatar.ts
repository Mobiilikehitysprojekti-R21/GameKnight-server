import fs from "fs";
import path from "path";
import multer from "multer";

const uploadDir = path.join("uploads", "avatars");

export const uploadAvatar = multer({
    storage: multer.diskStorage({
        destination: (_req, _file, cb) => {
            fs.mkdirSync(uploadDir, { recursive: true });
            cb(null, uploadDir);
        },
        filename: (req: any, file, cb) => {
            const userId = req.auth?.sub;
            if (!userId) {
                return cb(new Error("Missing auth"), "");
            }
            const safeUserId = String(userId).replace(/[<>:"/\\|?*]/g, "_");
            const extFromName = path.extname(file.originalname).toLowerCase();
            const ext = extFromName || ".jpg";
            cb(null, `avatar_${safeUserId}${ext}`);
        },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(null, false);
        }
        cb(null, true);
    },
});