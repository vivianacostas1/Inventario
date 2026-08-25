"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Importar rutas 
const health_1 = __importDefault(require("./routes/health"));
const users_1 = require("./routes/users");
const suppliers_1 = __importDefault(require("./routes/suppliers"));
const categories_1 = __importDefault(require("./routes/categories"));
const products_1 = __importDefault(require("./routes/products"));
const shareholder_products_1 = __importDefault(require("./routes/shareholder-products"));
const shareholders_1 = __importDefault(require("./routes/shareholders"));
const customers_1 = __importDefault(require("./routes/customers"));
const purchases_1 = __importDefault(require("./routes/purchases"));
const sales_1 = __importDefault(require("./routes/sales"));
const dividends_1 = __importDefault(require("./routes/dividends"));
const warehouses_1 = __importDefault(require("./routes/warehouses"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const stocks_1 = __importDefault(require("./routes/stocks"));
const stock_movements_1 = __importDefault(require("./routes/stock-movements"));
const purchase_items_1 = __importDefault(require("./routes/purchase-items"));
const sale_items_1 = __importDefault(require("./routes/sale-items"));
const product_analytics_1 = __importDefault(require("./routes/product-analytics"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
// Cargar variables de entorno (SIEMPRE primero) 
dotenv_1.default.config();
// Crear la aplicación Express con tipado TypeScript 
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || "3000", 10);
// ──────────────────────────────────────────────────── 
// MIDDLEWARES GLOBALES 
// ──────────────────────────────────────────────────── 
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options(/.*/, (0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ──────────────────────────────────────────────────── 
// RUTAS 
// ──────────────────────────────────────────────────── 
app.use('/health', health_1.default);
app.use("/api/users", users_1.userRoutes);
app.use("/api/suppliers", suppliers_1.default);
app.use("/api/categories", categories_1.default);
app.use("/api/products", products_1.default);
app.use("/api/shareholder-products", shareholder_products_1.default);
app.use("/api/shareholders", shareholders_1.default);
app.use("/api/customers", customers_1.default);
app.use("/api/purchases", purchases_1.default);
app.use("/api/sales", sales_1.default);
app.use("/api/dividends", dividends_1.default);
app.use("/api/warehouses", warehouses_1.default);
app.use("/api/stocks", stocks_1.default);
app.use("/api/stock-movements", stock_movements_1.default);
app.use("/api/purchase-items", purchase_items_1.default);
app.use("/api/sale-items", sale_items_1.default);
app.use("/api/product-analytics", product_analytics_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/analytics", analytics_routes_1.default);
// Ruta raíz informativa 
app.get('/', (req, res) => {
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
app.use((req, res) => {
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
exports.default = app;
