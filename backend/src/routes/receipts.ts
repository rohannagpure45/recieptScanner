import { Router } from 'express';
import multer from 'multer';
import { createReceiptJob, getReceiptStatus } from '../controllers/receiptController.ts';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });
const router = Router();

router.post('/', upload.single('receipt'), createReceiptJob);
router.get('/:id', getReceiptStatus);

export default router;
