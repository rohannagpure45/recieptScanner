import { Router } from 'express';
import multer from 'multer';
import { createReceiptJob, getReceiptStatus, sendEmails } from '../controllers/receiptController';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });
const router = Router();

router.post('/', upload.single('receipt'), createReceiptJob);
router.get('/:id', getReceiptStatus);
router.post('/email', sendEmails);

export default router;
