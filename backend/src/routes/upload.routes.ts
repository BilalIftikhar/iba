import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const uploadRouter = Router();

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../public/uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4();
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// POST /api/v1/upload — Authenticated upload
uploadRouter.post('/', upload.single('file'), (req: any, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileUrl = `${process.env.BACKEND_URL || 'http://localhost:4000'}/uploads/${req.file.filename}`;
        
        return res.status(201).json({ 
            success: true, 
            url: fileUrl,
            name: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype
        });
    } catch (err) {
        console.error('[Upload]', err);
        return res.status(500).json({ error: 'Upload failed' });
    }
});
