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

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCustomers: 0,
    totalSuppliers: 0,
    lowStockItems: 0,
  });
  const [loading, setLoading] = useState(true);

  // Opcional: Puedes cargar estadísticas reales desde tus endpoints si ya los tienes creados
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Ejemplo haciendo peticiones en paralelo a tus rutas del backend
        const [productsRes, customersRes, suppliersRes] = await Promise.all([
          api.get('/products').catch(() => ({ data: [] })),
          api.get('/customers').catch(() => ({ data: [] })),
          api.get('/suppliers').catch(() => ({ data: [] })),
        ]);

        setStats({
          totalProducts: Array.isArray(productsRes.data) ? productsRes.data.length : 0,
          totalCustomers: Array.isArray(customersRes.data) ? customersRes.data.length : 0,
          totalSuppliers: Array.isArray(suppliersRes.data) ? suppliersRes.data.length : 0,
          lowStockItems: 0, // Puedes calcularlo si filtras productos con stock bajo
        });
      } catch (error) {
        console.error('Error al cargar estadísticas del dashboard', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
          <p className="text-3xl font-bold text-amber-400 mt-2">0</p>
          <span className="text-xs text-gray-500 mt-3 inline-block">Stock óptimo</span>
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