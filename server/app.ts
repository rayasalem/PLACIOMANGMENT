
import express, { Request, Response, NextFunction } from 'express';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes';
import sessionRoutes from './routes/sessionRoutes';
import financialRoutes from './routes/financialRoutes';

const app = express();

app.use(express.json() as any);

// CORS Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const allowedOrigin = process.env.FRONTEND_URL || '*';
  
  const expressRes = res as any;
  const expressReq = req as any;

  expressRes.header('Access-Control-Allow-Origin', allowedOrigin);
  expressRes.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  expressRes.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (expressReq.method === 'OPTIONS') {
    expressRes.sendStatus(200);
    return;
  }
  next();
});

// Routes Registration
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/finance', financialRoutes);

export default app;
