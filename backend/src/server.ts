import express from 'express';
import morgan from 'morgan';
import receiptRouter from './routes/receipts';

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use('/api/receipts', receiptRouter);

// Simple health and root routes for MVP visibility
app.get('/', (_req, res) => {
  res.send('Receipt Scanner API is running');
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
