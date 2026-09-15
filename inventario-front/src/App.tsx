import { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';

import { UsersPage } from './pages/UsersPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { ShareholdersPage } from './pages/ShareholdersPage';
import { ClientsPage } from './pages/ClientsPage';
import { SalesPage } from './pages/SalesPage';
import { PurchasesPage } from './pages/PurchasesPage';
import { StockMovementsPage } from './pages/StockMovementsPage';
import { StocksPage } from './pages/StocksPage';
import { WarehousesPage } from './pages/WarehousesPage';
import { SalesProfitView } from './components/SalesProfitView';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';

import type { ReactNode } from 'react';

// ============================================================
// RUTA PROTEGIDA
// ============================================================

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-lg">Cargando aplicación...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// ============================================================
// LAYOUT PRINCIPAL
// ============================================================

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const [openSections, setOpenSections] = useState({
    inventory: true,
    operations: true,
    admin: true,
    catalogs: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex overflow-hidden">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`bg-gray-900 border-r border-gray-800 flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out z-30 ${
          isSidebarExpanded ? 'w-64' : 'w-20'
        }`}
      >
        <div>

          {/* CABECERA */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            {isSidebarExpanded && (
              <span className="font-bold text-xl text-indigo-400 truncate">
                Inventario App
              </span>
            )}

            <button
              onClick={() =>
                setIsSidebarExpanded(!isSidebarExpanded)
              }
              className="p-1.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition mx-auto"
              title={
                isSidebarExpanded
                  ? 'Ocultar menú'
                  : 'Mostrar menú'
              }
            >
              {isSidebarExpanded ? '◀' : '▶'}
            </button>
          </div>

          {/* =================================================
              NAVEGACIÓN
          ================================================= */}

          <nav className="p-3 space-y-4 text-sm overflow-y-auto max-h-[calc(100vh-140px)]">

            {/* DASHBOARD */}
            <div>
              <Link
                to="/"
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                  isActive('/')
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                title="Dashboard"
              >
                <span>📊</span>

                {isSidebarExpanded && (
                  <span>Dashboard</span>
                )}
              </Link>
            </div>

            {/* =================================================
                INVENTARIO
            ================================================= */}

            <div>
              <button
                onClick={() =>
                  toggleSection('inventory')
                }
                className="w-full flex items-center justify-between px-2 py-2 text-gray-400 hover:text-white font-semibold uppercase text-xs tracking-wider"
              >
                <span className="flex items-center gap-2">
                  <span>📦</span>

                  {isSidebarExpanded && (
                    <span>Inventario</span>
                  )}
                </span>

                {isSidebarExpanded && (
                  <span>
                    {openSections.inventory
                      ? '▼'
                      : '▶'}
                  </span>
                )}
              </button>

              {openSections.inventory &&
                isSidebarExpanded && (
                  <div className="ml-3 mt-1 space-y-1 border-l border-gray-800 pl-3">

                    <Link
                      to="/stock-movements"
                      className={`block px-3 py-1.5 rounded-md transition ${
                        isActive('/stock-movements')
                          ? 'bg-amber-600 text-white font-medium'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      Movimientos
                    </Link>

                    <Link
                      to="/stocks"
                      className={`block px-3 py-1.5 rounded-md transition ${
                        isActive('/stocks')
                          ? 'bg-teal-600 text-white font-medium'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      Stock Actual
                    </Link>

                    <Link
                      to="/purchases"
                      className={`block px-3 py-1.5 rounded-md transition ${
                        isActive('/purchases')
                          ? 'bg-emerald-600 text-white font-medium'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      Compras
                    </Link>

                  </div>
                )}
            </div>

            {/* =================================================
                OPERACIONES
            ================================================= */}

            <div>
              <button
                onClick={() =>
                  toggleSection('operations')
                }
                className="w-full flex items-center justify-between px-2 py-2 text-gray-400 hover:text-white font-semibold uppercase text-xs tracking-wider"
              >
                <span className="flex items-center gap-2">
                  <span>🛒</span>

                  {isSidebarExpanded && (
                    <span>Operaciones</span>
                  )}
                </span>

                {isSidebarExpanded && (
                  <span>
                    {openSections.operations
                      ? '▼'
                      : '▶'}
                  </span>
                )}
              </button>

              {openSections.operations &&
                isSidebarExpanded && (
                  <div className="ml-3 mt-1 space-y-1 border-l border-gray-800 pl-3">

                    <Link
                      to="/sales"
                      className={`block px-3 py-1.5 rounded-md transition ${
                        isActive('/sales')
                          ? 'bg-emerald-600 text-white font-medium'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      Ventas
                    </Link>

                    <Link
                      to="/reports"
                      className={`block px-3 py-1.5 rounded-md transition ${
                        isActive('/reports')
                          ? 'bg-emerald-600 text-white font-medium'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      📄 Proyección según Inventario Restante
                    </Link>

                    <Link
                      to="/sales-profit"
                      className={`block px-3 py-1.5 rounded-md transition ${
                        isActive('/sales-profit')
                          ? 'bg-indigo-600 text-white font-medium'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      📈 Ganancias Mensuales
                    </Link>

                    <Link
                      to="/analytics"
                      className={`block px-3 py-1.5 rounded-md transition ${
                        isActive('/analytics')
                          ? 'bg-purple-600 text-white font-medium'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      🧠 Análisis de Datos
                    </Link>

                  </div>
                )}
            </div>

            {/* =================================================
                ADMINISTRACIÓN
            ================================================= */}

            {user?.role === 'ADMIN' && (
              <div>

                <button
                  onClick={() =>
                    toggleSection('admin')
                  }
                  className="w-full flex items-center justify-between px-2 py-2 text-gray-400 hover:text-white font-semibold uppercase text-xs tracking-wider"
                >
                  <span className="flex items-center gap-2">
                    <span>⚙️</span>

                    {isSidebarExpanded && (
                      <span>Administración</span>
                    )}
                  </span>

                  {isSidebarExpanded && (
                    <span>
                      {openSections.admin
                        ? '▼'
                        : '▶'}
                    </span>
                  )}
                </button>

                {openSections.admin &&
                  isSidebarExpanded && (
                    <div className="ml-3 mt-1 space-y-2 border-l border-gray-800 pl-3">

                      {/* CATÁLOGOS */}

                      <div>

                        <button
                          onClick={() =>
                            toggleSection('catalogs')
                          }
                          className="w-full flex items-center justify-between px-3 py-1 text-gray-400 hover:text-white font-medium text-xs uppercase"
                        >
                          <span>📁 Catálogos</span>

                          <span>
                            {openSections.catalogs
                              ? '▼'
                              : '▶'}
                          </span>
                        </button>

                        {openSections.catalogs && (
                          <div className="ml-2 mt-1 space-y-1 border-l border-gray-700 pl-2">

                            <Link
                              to="/products"
                              className={`block px-2.5 py-1 rounded-md transition ${
                                isActive('/products')
                                  ? 'bg-indigo-600 text-white'
                                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                              }`}
                            >
                              Productos
                            </Link>

                            <Link
                              to="/categories"
                              className={`block px-2.5 py-1 rounded-md transition ${
                                isActive('/categories')
                                  ? 'bg-indigo-600 text-white'
                                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                              }`}
                            >
                              Categorías
                            </Link>

                            <Link
                              to="/warehouses"
                              className={`block px-2.5 py-1 rounded-md transition ${
                                isActive('/warehouses')
                                  ? 'bg-indigo-600 text-white'
                                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                              }`}
                            >
                              Almacenes
                            </Link>

                            <Link
                              to="/clients"
                              className={`block px-2.5 py-1 rounded-md transition ${
                                isActive('/clients')
                                  ? 'bg-indigo-600 text-white'
                                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                              }`}
                            >
                              Clientes
                            </Link>

                            <Link
                              to="/suppliers"
                              className={`block px-2.5 py-1 rounded-md transition ${
                                isActive('/suppliers')
                                  ? 'bg-indigo-600 text-white'
                                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                              }`}
                            >
                              Proveedores
                            </Link>

                            <Link
                              to="/shareholders"
                              className={`block px-2.5 py-1 rounded-md transition ${
                                isActive('/shareholders')
                                  ? 'bg-indigo-600 text-white'
                                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                              }`}
                            >
                              Accionistas
                            </Link>

                          </div>
                        )}

                      </div>

                      {/* USUARIOS */}

                      <Link
                        to="/users"
                        className={`block px-3 py-1.5 rounded-md transition ${
                          isActive('/users')
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                      >
                        Usuarios
                      </Link>

                    </div>
                  )}

              </div>
            )}

          </nav>
        </div>

        {/* =====================================================
            PERFIL Y CERRAR SESIÓN
        ===================================================== */}

        <div className="p-3 border-t border-gray-800 bg-gray-900/50">

          {isSidebarExpanded && (
            <div className="mb-2">

              <p className="text-xs text-gray-400 truncate">
                Conectado como:
              </p>

              <p className="text-xs font-medium text-white truncate">
                {user?.name || user?.email}
              </p>

              <span className="inline-block mt-0.5 px-2 py-0.5 text-[9px] font-bold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                {user?.role}
              </span>

            </div>
          )}

          <button
            onClick={logout}
            className="w-full py-2 bg-red-600/80 hover:bg-red-600 rounded text-xs font-semibold transition flex items-center justify-center space-x-1"
            title="Cerrar Sesión"
          >
            <span>🚪</span>

            {isSidebarExpanded && (
              <span>Cerrar Sesión</span>
            )}
          </button>

        </div>
      </aside>

      {/* =====================================================
          CONTENIDO PRINCIPAL
      ===================================================== */}

      <main className="flex-1 overflow-y-auto bg-gray-900 flex flex-col">

        {!isSidebarExpanded && (
          <div className="bg-gray-900 border-b border-gray-800 p-3 flex items-center">

            <button
              onClick={() =>
                setIsSidebarExpanded(true)
              }
              className="px-3 py-1.5 rounded bg-gray-800 text-gray-300 hover:text-white text-xs font-medium flex items-center gap-2 transition"
            >
              <span>▶ Abrir Menú</span>
            </button>

          </div>
        )}

        <div className="flex-1">
          {children}
        </div>

      </main>

    </div>
  );
};

// ============================================================
// DASHBOARD
// ============================================================

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-8 max-w-4xl mx-auto">

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">

        <h1 className="text-3xl font-bold text-indigo-400 mb-2">
          ¡Bienvenido de nuevo!
        </h1>

        <p className="text-gray-300">
          Has iniciado sesión correctamente en el sistema de gestión de inventario.
        </p>

        <div className="mt-4 p-4 bg-gray-900/50 rounded border border-gray-700">

          <p className="text-sm text-gray-400">
            Correo:{' '}
            <span className="text-white">
              {user?.email}
            </span>
          </p>

          <p className="text-sm text-gray-400">
            Rol asignado:{' '}
            <span className="text-indigo-300 font-semibold">
              {user?.role}
            </span>
          </p>

        </div>

      </div>

    </div>
  );
};

// ============================================================
// APP
// ============================================================

export function App() {
  return (
    <AuthProvider>

      <BrowserRouter>

        <Routes>

          {/* LOGIN */}
          <Route
            path="/login"
            element={<LoginPage />}
          />

          {/* DASHBOARD */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* PRODUCTOS */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ProductsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* CATEGORÍAS */}
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CategoriesPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* PROVEEDORES */}
          <Route
            path="/suppliers"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <SuppliersPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* ACCIONISTAS */}
          <Route
            path="/shareholders"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ShareholdersPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* CLIENTES */}
          <Route
            path="/clients"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ClientsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* VENTAS */}
          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <SalesPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* REPORTES */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ReportsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* GANANCIAS */}
          <Route
            path="/sales-profit"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <SalesProfitView />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* ANALYTICS */}
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AnalyticsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* COMPRAS */}
          <Route
            path="/purchases"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <PurchasesPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* ALMACENES */}
          <Route
            path="/warehouses"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <WarehousesPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* STOCK */}
          <Route
            path="/stocks"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <StocksPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* MOVIMIENTOS */}
          <Route
            path="/stock-movements"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <StockMovementsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* USUARIOS */}
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <UsersPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* RUTA NO ENCONTRADA */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>

      </BrowserRouter>

    </AuthProvider>
  );
}

export default App;
