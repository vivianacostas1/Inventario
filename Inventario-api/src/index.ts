import express, { Application, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config(); 

// Importar rutas de Inventario
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
import tiendaProductRoutes from './routes/tienda-product.routes';
import imageRoutes from './controllers/imageController';

// Crear aplicación
const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// ────────────────────────────────────────────────────
// CORS (Estructura adaptada para aceptar cualquier puerto local)
// ────────────────────────────────────────────────────

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin Origin (Postman, Insomnia, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Permitir automáticamente cualquier puerto de localhost o 127.0.0.1 (ideal para Flutter/React)
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }

      // Permitir dominios fijos en allowedOrigins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Permitir despliegues de Vercel que comiencen con inventario-
      if (
        origin.startsWith('https://inventario-') &&
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }

      console.log('❌ CORS bloqueó el origen:', origin);
      callback(new Error('Origen no permitido por CORS'));
    },

    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Parsear JSON
app.use(express.json());

// Parsear formularios
app.use(express.urlencoded({ extended: true }));

// ────────────────────────────────────────────────────
// ARCHIVOS ESTÁTICOS (Imágenes)
// ────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

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
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/tienda-products', tiendaProductRoutes); 
app.use('/api', imageRoutes); //

// Ruta principal
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
// 404
// ────────────────────────────────────────────────────

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method,
  });
});

// ────────────────────────────────────────────────────
// INICIAR SERVIDOR
// ────────────────────────────────────────────────────

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n🚀 Inventario API iniciada');
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Frontend permitido: ${process.env.FRONTEND_URL || 'Vercel Preview'}`);
});

export default app;