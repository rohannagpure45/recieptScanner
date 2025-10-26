import express from 'express';
import morgan from 'morgan';
import receiptRouter from './routes/receipts';

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use('/api/receipts', receiptRouter);

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
