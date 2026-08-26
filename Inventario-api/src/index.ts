import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar rutas
import healthRouter from './routes/health';
import { userRoutes } from './routes/users';
import supplierRoutes from './routes/suppliers';
import categoryRoutes from './routes/categories';
import productRoutes from './routes/products';
import shareholderProductRoutes from './routes/shareholder-products';
import shareholderRoutes from './routes/shareholders';
import customerRoutes from './routes/customers';
import purchaseRoutes from './routes/purchases';
import saleRoutes from './routes/sales';
import dividendRoutes from './routes/dividends';
import warehouseRoutes from './routes/warehouses';
import analyticsRoutes from './routes/analytics.routes';
import stockRoutes from './routes/stocks';
import stockMovementRoutes from './routes/stock-movements';
import purchaseItemRoutes from './routes/purchase-items';
import saleItemRoutes from './routes/sale-items';
import productAnalyticsRoutes from './routes/product-analytics';
import authRoutes from './routes/auth.routes';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app: Application = express();

// Render proporciona PORT mediante variable de entorno
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// ────────────────────────────────────────────────────
// CORS ABIERTO
// ────────────────────────────────────────────────────
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// ────────────────────────────────────────────────────
// MIDDLEWARES
// ────────────────────────────────────────────────────

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ────────────────────────────────────────────────────
// RUTAS
// ────────────────────────────────────────────────────

app.use('/health', healthRouter);
app.use('/api/users', userRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/shareholder-products', shareholderProductRoutes);
app.use('/api/shareholders', shareholderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/dividends', dividendRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/stock-movements', stockMovementRoutes);
app.use('/api/purchase-items', purchaseItemRoutes);
app.use('/api/sale-items', saleItemRoutes);
app.use('/api/product-analytics', productAnalyticsRoutes);

// AUTENTICACIÓN
app.use('/api/auth', authRoutes);

app.use('/api/analytics', analyticsRoutes);

// ────────────────────────────────────────────────────
// RUTA RAÍZ
// ────────────────────────────────────────────────────

app.get('/', (req: Request, res: Response) => {
  res.json({
    project: 'Inventario API',
    version: '1.0.0',
    status: 'online',
    description: 'Servidor Express con TypeScript + PostgreSQL',
    endpoints: {
      health: 'GET /health',
      login: 'POST /api/auth/login',
      register: 'POST /api/auth/register',
    },
  });
});

// ────────────────────────────────────────────────────
// MANEJO DE RUTAS NO ENCONTRADAS
// ────────────────────────────────────────────────────

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method,
  });
});

// ────────────────────────────────────────────────────
// MANEJO DE ERRORES
// ────────────────────────────────────────────────────

app.use(
  (
    err: Error,
    req: Request,
    res: Response,
    next: Function
  ) => {
    console.error('❌ Error del servidor:', err.message);

    return res.status(500).json({
      error: 'Error interno del servidor',
      message:
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'Error interno',
    });
  }
);

// ────────────────────────────────────────────────────
// INICIAR SERVIDOR
// ────────────────────────────────────────────────────

app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🚀 Inventario API iniciada');
  console.log(`📡 Puerto: ${PORT}`);
  console.log('🌐 CORS: Abierto a cualquier origen (*)');
  console.log(
    `🌍 Entorno: ${process.env.NODE_ENV || 'development'}`
  );
  console.log('');
});

export default app;