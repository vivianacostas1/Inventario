import express, { Application, Request, Response } from 'express'; 
import cors from 'cors'; 
import dotenv from 'dotenv'; 
 
// Importar rutas 
import healthRouter from './routes/health'; 
import { userRoutes } from './routes/users'; 
import supplierRoutes from "./routes/suppliers";
import categoryRoutes from "./routes/categories";
import productRoutes from "./routes/products";
import shareholderProductRoutes from "./routes/shareholder-products";
import shareholderRoutes from "./routes/shareholders";
import customerRoutes from "./routes/customers";
import purchaseRoutes from "./routes/purchases";
import saleRoutes from "./routes/sales";
import dividendRoutes from "./routes/dividends";
import warehouseRoutes from "./routes/warehouses";
import stockRoutes from "./routes/stocks";
import stockMovementRoutes from "./routes/stock-movements";
import purchaseItemRoutes from "./routes/purchase-items";
import saleItemRoutes from "./routes/sale-items";
import productAnalyticsRoutes from "./routes/product-analytics";
import authRoutes from "./routes/auth.routes";
 
// Cargar variables de entorno (SIEMPRE primero) 
dotenv.config(); 
 
// Crear la aplicación Express con tipado TypeScript 
const app: Application = express(); 
const PORT: number = parseInt(process.env.PORT || "3000", 10); 
 
// ──────────────────────────────────────────────────── 
// MIDDLEWARES GLOBALES 
// ──────────────────────────────────────────────────── 
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
 
// ──────────────────────────────────────────────────── 
// RUTAS 
// ──────────────────────────────────────────────────── 
app.use('/health', healthRouter); 
app.use("/api/users", userRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/shareholder-products", shareholderProductRoutes);
app.use("/api/shareholders", shareholderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/dividends", dividendRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/stock-movements", stockMovementRoutes);
app.use("/api/purchase-items", purchaseItemRoutes);
app.use("/api/sale-items", saleItemRoutes);
app.use("/api/product-analytics", productAnalyticsRoutes);
app.use("/api/auth", authRoutes);

// Ruta raíz informativa 
app.get('/', (req: Request, res: Response) => { 
  res.json({ 
    project: 'Inventario API', 
    version: '1.0.0', 
    clase: 1, 
    description: 'Servidor Express con TypeScript + PostgreSQL', 
    endpoints: { 
      health: 'GET /health', 
    }, 
  }); 
}); 
 
// ──────────────────────────────────────────────────── 
// MANEJO DE RUTAS NO ENCONTRADAS (404) 
// ──────────────────────────────────────────────────── 
app.use((req: Request, res: Response) => { 
  res.status(404).json({ 
    error: 'Ruta no encontrada', 
    path: req.path, 
    method: req.method, 
  }); 
}); 
 
// ──────────────────────────────────────────────────── 
// INICIAR EL SERVIDOR 
// ──────────────────────────────────────────────────── 
app.listen(PORT, () => { 
  console.log('\n🚀 Inventario API iniciada'); 
  console.log(`📡 Puerto: ${PORT}`); 
  console.log(`🔍 Health: http://localhost:${PORT}/health`); 
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}\n`); 
}); 
 
export default app;