"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = App;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("./context/AuthContext");
const LoginPage_1 = require("./pages/LoginPage");
const ProductsPage_1 = require("./pages/ProductsPage");
const UsersPage_1 = require("./pages/UsersPage");
const CategoriesPage_1 = require("./pages/CategoriesPage");
const SuppliersPage_1 = require("./pages/SuppliersPage");
const ShareholdersPage_1 = require("./pages/ShareholdersPage");
const ClientsPage_1 = require("./pages/ClientsPage");
const SalesPage_1 = require("./pages/SalesPage");
const PurchasesPage_1 = require("./pages/PurchasesPage");
const StockMovementsPage_1 = require("./pages/StockMovementsPage");
const StocksPage_1 = require("./pages/StocksPage");
const WarehousesPage_1 = require("./pages/WarehousesPage");
const SalesProfitView_1 = require("./components/SalesProfitView");
const AnalyticsPage_1 = require("./pages/AnalyticsPage"); // <-- Importación agregada
// Componente para proteger rutas privadas
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = (0, AuthContext_1.useAuth)();
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-lg">Cargando aplicación...</p>
      </div>);
    }
    if (!isAuthenticated) {
        return <react_router_dom_1.Navigate to="/login" replace/>;
    }
    return children;
};
// Layout principal con menú lateral actualizado
const MainLayout = ({ children }) => {
    const { user, logout } = (0, AuthContext_1.useAuth)();
    const location = (0, react_router_dom_1.useLocation)();
    const [openSections, setOpenSections] = (0, react_1.useState)({
        inventory: true,
        operations: true,
        admin: true,
        catalogs: true,
    });
    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };
    const isActive = (path) => location.pathname === path;
    return (<div className="min-h-screen bg-gray-950 text-white flex">
      {/* SIDEBAR LATERAL */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-5 border-b border-gray-800 flex items-center justify-between">
            <span className="font-bold text-xl text-indigo-400">Inventario App</span>
          </div>

          <nav className="p-4 space-y-4 text-sm">
            <div>
              <react_router_dom_1.Link to="/" className={`flex items-center px-3 py-2 rounded-md transition ${isActive('/') ? 'bg-indigo-600 text-white font-medium' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                📊 Dashboard
              </react_router_dom_1.Link>
            </div>

            {/* SECCIÓN: INVENTARIO (Movimientos, Stock, Compras) */}
            <div>
              <button onClick={() => toggleSection('inventory')} className="w-full flex items-center justify-between px-3 py-2 text-gray-400 hover:text-white font-semibold uppercase text-xs tracking-wider">
                <span>📦 Inventario</span>
                <span>{openSections.inventory ? '▼' : '▶'}</span>
              </button>
              {openSections.inventory && (<div className="ml-3 mt-1 space-y-1 border-l border-gray-800 pl-3">
                  <react_router_dom_1.Link to="/stock-movements" className={`block px-3 py-1.5 rounded-md transition ${isActive('/stock-movements') ? 'bg-amber-600 text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>Movimientos</react_router_dom_1.Link>
                  <react_router_dom_1.Link to="/stocks" className={`block px-3 py-1.5 rounded-md transition ${isActive('/stocks') ? 'bg-teal-600 text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>Stock Actual</react_router_dom_1.Link>
                  <react_router_dom_1.Link to="/purchases" className={`block px-3 py-1.5 rounded-md transition ${isActive('/purchases') ? 'bg-emerald-600 text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>Compras</react_router_dom_1.Link>
                </div>)}
            </div>

            {/* SECCIÓN: OPERACIONES (Ventas, Ganancias y Análisis) */}
            <div>
              <button onClick={() => toggleSection('operations')} className="w-full flex items-center justify-between px-3 py-2 text-gray-400 hover:text-white font-semibold uppercase text-xs tracking-wider">
                <span>🛒 Operaciones</span>
                <span>{openSections.operations ? '▼' : '▶'}</span>
              </button>
              {openSections.operations && (<div className="ml-3 mt-1 space-y-1 border-l border-gray-800 pl-3">
                  <react_router_dom_1.Link to="/sales" className={`block px-3 py-1.5 rounded-md transition ${isActive('/sales') ? 'bg-emerald-600 text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>Ventas</react_router_dom_1.Link>
                  <react_router_dom_1.Link to="/sales-profit" className={`block px-3 py-1.5 rounded-md transition ${isActive('/sales-profit') ? 'bg-indigo-600 text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>📈 Ganancias</react_router_dom_1.Link>
                  {/* Opción del menú agregada */}
                  <react_router_dom_1.Link to="/analytics" className={`block px-3 py-1.5 rounded-md transition ${isActive('/analytics') ? 'bg-purple-600 text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>🧠 Análisis de Datos</react_router_dom_1.Link>
                </div>)}
            </div>

            {/* SECCIÓN: ADMINISTRACIÓN (Catálogos y Usuarios) */}
            {user?.role === 'ADMIN' && (<div>
                <button onClick={() => toggleSection('admin')} className="w-full flex items-center justify-between px-3 py-2 text-gray-400 hover:text-white font-semibold uppercase text-xs tracking-wider">
                  <span>⚙️ Administración</span>
                  <span>{openSections.admin ? '▼' : '▶'}</span>
                </button>
                {openSections.admin && (<div className="ml-3 mt-1 space-y-2 border-l border-gray-800 pl-3">
                    {/* Submenú Catálogos */}
                    <div>
                      <button onClick={() => toggleSection('catalogs')} className="w-full flex items-center justify-between px-3 py-1 text-gray-400 hover:text-white font-medium text-xs uppercase">
                        <span>📁 Catálogos</span>
                        <span>{openSections.catalogs ? '▼' : '▶'}</span>
                      </button>
                      {openSections.catalogs && (<div className="ml-2 mt-1 space-y-1 border-l border-gray-700 pl-2">
                          <react_router_dom_1.Link to="/products" className={`block px-2.5 py-1 rounded-md transition ${isActive('/products') ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>Productos</react_router_dom_1.Link>
                          <react_router_dom_1.Link to="/categories" className={`block px-2.5 py-1 rounded-md transition ${isActive('/categories') ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>Categorías</react_router_dom_1.Link>
                          <react_router_dom_1.Link to="/warehouses" className={`block px-2.5 py-1 rounded-md transition ${isActive('/warehouses') ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>Almacenes</react_router_dom_1.Link>
                          <react_router_dom_1.Link to="/clients" className={`block px-2.5 py-1 rounded-md transition ${isActive('/clients') ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>Clientes</react_router_dom_1.Link>
                          <react_router_dom_1.Link to="/suppliers" className={`block px-2.5 py-1 rounded-md transition ${isActive('/suppliers') ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>Proveedores</react_router_dom_1.Link>
                          <react_router_dom_1.Link to="/shareholders" className={`block px-2.5 py-1 rounded-md transition ${isActive('/shareholders') ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>Accionistas</react_router_dom_1.Link>
                        </div>)}
                    </div>
                    {/* Usuarios */}
                    <react_router_dom_1.Link to="/users" className={`block px-3 py-1.5 rounded-md transition ${isActive('/users') ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>Usuarios</react_router_dom_1.Link>
                  </div>)}
              </div>)}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
          <div className="mb-3">
            <p className="text-xs text-gray-400 truncate">Conectado como:</p>
            <p className="text-sm font-medium text-white truncate">{user?.name || user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
              {user?.role}
            </span>
          </div>
          <button onClick={logout} className="w-full py-2 bg-red-600/80 hover:bg-red-600 rounded text-xs font-semibold transition flex items-center justify-center space-x-2">
            <span>🚪 Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-900">
        {children}
      </main>
    </div>);
};
const Dashboard = () => {
    const { user } = (0, AuthContext_1.useAuth)();
    return (<div className="p-8 max-w-4xl mx-auto">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
        <h1 className="text-3xl font-bold text-indigo-400 mb-2">¡Bienvenido de nuevo!</h1>
        <p className="text-gray-300">Has iniciado sesión correctamente en el sistema de gestión de inventario.</p>
        <div className="mt-4 p-4 bg-gray-900/50 rounded border border-gray-700">
          <p className="text-sm text-gray-400">Correo: <span className="text-white">{user?.email}</span></p>
          <p className="text-sm text-gray-400">Rol asignado: <span className="text-indigo-300 font-semibold">{user?.role}</span></p>
        </div>
      </div>
    </div>);
};
function App() {
    return (<AuthContext_1.AuthProvider>
      <react_router_dom_1.BrowserRouter>
        <react_router_dom_1.Routes>
          <react_router_dom_1.Route path="/login" element={<LoginPage_1.LoginPage />}/>
          
          <react_router_dom_1.Route path="/" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>}/>
          <react_router_dom_1.Route path="/products" element={<ProtectedRoute><MainLayout><ProductsPage_1.ProductsPage /></MainLayout></ProtectedRoute>}/>
          <react_router_dom_1.Route path="/categories" element={<ProtectedRoute><MainLayout><CategoriesPage_1.CategoriesPage /></MainLayout></ProtectedRoute>}/>
          <react_router_dom_1.Route path="/suppliers" element={<ProtectedRoute><MainLayout><SuppliersPage_1.SuppliersPage /></MainLayout></ProtectedRoute>}/>
          <react_router_dom_1.Route path="/shareholders" element={<ProtectedRoute><MainLayout><ShareholdersPage_1.ShareholdersPage /></MainLayout></ProtectedRoute>}/>
          <react_router_dom_1.Route path="/clients" element={<ProtectedRoute><MainLayout><ClientsPage_1.ClientsPage /></MainLayout></ProtectedRoute>}/>
          <react_router_dom_1.Route path="/sales" element={<ProtectedRoute><MainLayout><SalesPage_1.SalesPage /></MainLayout></ProtectedRoute>}/>
          <react_router_dom_1.Route path="/sales-profit" element={<ProtectedRoute><MainLayout><SalesProfitView_1.SalesProfitView /></MainLayout></ProtectedRoute>}/>
          
          {/* Ruta agregada */}
          <react_router_dom_1.Route path="/analytics" element={<ProtectedRoute><MainLayout><AnalyticsPage_1.AnalyticsPage /></MainLayout></ProtectedRoute>}/>

          <react_router_dom_1.Route path="/purchases" element={<ProtectedRoute><MainLayout><PurchasesPage_1.PurchasesPage /></MainLayout></ProtectedRoute>}/>
          <react_router_dom_1.Route path="/warehouses" element={<ProtectedRoute><MainLayout><WarehousesPage_1.WarehousesPage /></MainLayout></ProtectedRoute>}/>
          <react_router_dom_1.Route path="/stocks" element={<ProtectedRoute><MainLayout><StocksPage_1.StocksPage /></MainLayout></ProtectedRoute>}/>
          <react_router_dom_1.Route path="/stock-movements" element={<ProtectedRoute><MainLayout><StockMovementsPage_1.StockMovementsPage /></MainLayout></ProtectedRoute>}/>
          <react_router_dom_1.Route path="/users" element={<ProtectedRoute><MainLayout><UsersPage_1.UsersPage /></MainLayout></ProtectedRoute>}/>

          <react_router_dom_1.Route path="*" element={<react_router_dom_1.Navigate to="/" replace/>}/>
        </react_router_dom_1.Routes>
      </react_router_dom_1.BrowserRouter>
    </AuthContext_1.AuthProvider>);
}
exports.default = App;
