import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalSuppliers: number;
  lowStockItems: number;
}

interface ProductStockSummary {
  id: string;
  sku: string;
  name: string;
  imageUrl?: string | null;
  initialStock: number;
  quantitySold: number;
  remainingStock: number;
  minStock: number;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCustomers: 0,
    totalSuppliers: 0,
    lowStockItems: 0,
  });
  const [stockSummary, setStockSummary] = useState<ProductStockSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, customersRes, suppliersRes, summaryRes] = await Promise.all([
          api.get('/products').catch(() => ({ data: [] })),
          api.get('/customers').catch(() => ({ data: [] })),
          api.get('/suppliers').catch(() => ({ data: [] })),
          api.get('/products/inventory-summary').catch(() => ({ data: [] })), // Endpoint que calcula los 3 stocks
        ]);

        const summaryData: ProductStockSummary[] = Array.isArray(summaryRes.data) ? summaryRes.data : [];
        const lowStockCount = summaryData.filter((item) => item.remainingStock <= item.minStock).length;

        setStats({
          totalProducts: Array.isArray(productsRes.data) ? productsRes.data.length : 0,
          totalCustomers: Array.isArray(customersRes.data) ? customersRes.data.length : 0,
          totalSuppliers: Array.isArray(suppliersRes.data) ? suppliersRes.data.length : 0,
          lowStockItems: lowStockCount,
        });

        setStockSummary(summaryData);
      } catch (error) {
        console.error('Error al cargar datos del dashboard', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const filteredSummary = stockSummary.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Bienvenida */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-indigo-400 mb-1">
            ¡Bienvenido de nuevo, {user?.name || 'Usuario'}! 👋
          </h1>
          <p className="text-gray-300">
            Panel general del sistema de gestión e inventario.
          </p>
        </div>
        <div className="hidden md:block text-right bg-gray-900/60 px-4 py-2 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400">Rol activo</p>
          <span className="text-indigo-300 font-semibold">{user?.role}</span>
        </div>
      </div>

      {/* Tarjetas de Métricas (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md">
          <p className="text-sm font-medium text-gray-400">Productos Totales</p>
          <p className="text-3xl font-bold text-white mt-2">
            {loading ? '...' : stats.totalProducts}
          </p>
          <Link to="/products" className="text-xs text-indigo-400 hover:underline mt-3 inline-block">
            Ver inventario &rarr;
          </Link>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md">
          <p className="text-sm font-medium text-gray-400">Clientes Registrados</p>
          <p className="text-3xl font-bold text-white mt-2">
            {loading ? '...' : stats.totalCustomers}
          </p>
          <span className="text-xs text-gray-500 mt-3 inline-block">Módulo de Clientes</span>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md">
          <p className="text-sm font-medium text-gray-400">Proveedores</p>
          <p className="text-3xl font-bold text-white mt-2">
            {loading ? '...' : stats.totalSuppliers}
          </p>
          <span className="text-xs text-gray-500 mt-3 inline-block">Gestión de Proveedores</span>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md">
          <p className="text-sm font-medium text-gray-400">Alertas de Stock</p>
          <p className={`text-3xl font-bold mt-2 ${stats.lowStockItems > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {loading ? '...' : stats.lowStockItems}
          </p>
          <span className="text-xs text-gray-500 mt-3 inline-block">
            {stats.lowStockItems > 0 ? 'Productos por reponer' : 'Stock óptimo'}
          </span>
        </div>
      </div>

      {/* NUEVO MÓDULO: Control de Stock Inicial, Vendido y Restante */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Balance de Inventarios</h2>
            <p className="text-sm text-gray-400">
              Seguimiento de stock inicial, unidades vendidas y disponible actual
            </p>
          </div>

          <input
            type="text"
            placeholder="Buscar por SKU o Nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/60 border-b border-gray-700 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">Producto</th>
                <th className="py-3 px-4 text-center">Stock Inicial</th>
                <th className="py-3 px-4 text-center">Vendidos</th>
                <th className="py-3 px-4 text-center">Stock Restante</th>
                <th className="py-3 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-400">
                    Cargando datos de inventario...
                  </td>
                </tr>
              ) : filteredSummary.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-400">
                    No se encontraron productos registrados.
                  </td>
                </tr>
              ) : (
                filteredSummary.map((item) => {
                  const isLowStock = item.remainingStock <= item.minStock;

                  return (
                    <tr key={item.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-md border border-gray-700"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-900 rounded-md border border-gray-700 flex items-center justify-center text-gray-500 font-bold text-xs">
                            N/A
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-200">{item.name}</p>
                          <p className="text-xs text-gray-400">SKU: {item.sku}</p>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="bg-gray-900/80 text-gray-300 px-3 py-1 rounded-md font-mono border border-gray-700">
                          {item.initialStock}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="bg-blue-950/60 text-blue-400 border border-blue-800/50 px-3 py-1 rounded-md font-mono">
                          {item.quantitySold}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-md font-mono border ${
                            isLowStock
                              ? 'bg-red-950/60 text-red-400 border-red-800/50'
                              : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50'
                          }`}
                        >
                          {item.remainingStock}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        {isLowStock ? (
                          <span className="text-xs px-2.5 py-1 bg-red-900/40 text-red-400 border border-red-700/50 font-medium rounded-full">
                            Stock Bajo
                          </span>
                        ) : (
                          <span className="text-xs px-2.5 py-1 bg-emerald-900/40 text-emerald-400 border border-emerald-700/50 font-medium rounded-full">
                            Óptimo
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Accesos Rápidos a Módulos del Sistema */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-4">Accesos Rápidos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link
            to="/products"
            className="p-4 bg-gray-900/50 hover:bg-gray-700/50 border border-gray-700 rounded-lg text-center transition flex flex-col items-center justify-center space-y-2"
          >
            <span className="text-2xl">📦</span>
            <span className="text-sm font-medium text-gray-200">Productos</span>
          </Link>

          {user?.role === 'ADMIN' && (
            <Link
              to="/users"
              className="p-4 bg-gray-900/50 hover:bg-gray-700/50 border border-gray-700 rounded-lg text-center transition flex flex-col items-center justify-center space-y-2"
            >
              <span className="text-2xl">👥</span>
              <span className="text-sm font-medium text-gray-200">Usuarios</span>
            </Link>
          )}

          <div className="p-4 bg-gray-900/30 border border-gray-800 rounded-lg text-center flex flex-col items-center justify-center space-y-2 opacity-60">
            <span className="text-2xl">🛒</span>
            <span className="text-sm font-medium text-gray-400">Ventas</span>
          </div>

          <div className="p-4 bg-gray-900/30 border border-gray-800 rounded-lg text-center flex flex-col items-center justify-center space-y-2 opacity-60">
            <span className="text-2xl">📥</span>
            <span className="text-sm font-medium text-gray-400">Compras</span>
          </div>

          <div className="p-4 bg-gray-900/30 border border-gray-800 rounded-lg text-center flex flex-col items-center justify-center space-y-2 opacity-60">
            <span className="text-2xl">🏭</span>
            <span className="text-sm font-medium text-gray-400">Almacenes</span>
          </div>

          <div className="p-4 bg-gray-900/30 border border-gray-800 rounded-lg text-center flex flex-col items-center justify-center space-y-2 opacity-60">
            <span className="text-2xl">📊</span>
            <span className="text-sm font-medium text-gray-400">Analíticas</span>
          </div>
        </div>
      </div>
    </div>
  );
};