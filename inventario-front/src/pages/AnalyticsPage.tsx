import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Chart as ChartJS, 
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Registramos los módulos de Chart.js
ChartJS.register(
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
);

export function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar analíticas", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6 text-white">Cargando análisis avanzado...</div>;
  if (!data) return <div className="p-6 text-white">No hay datos disponibles.</div>;

  const { summary, topProducts, salesPerMonth, advancedInsights, alerts } = data;

  // Configuración de Torta (Productos más vendidos)
  const pieChartData = {
    labels: topProducts.map((p: any) => p.productName),
    datasets: [{
      data: topProducts.map((p: any) => p.totalQuantitySold),
      backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#a855f7'],
    }]
  };

  // Configuración de Barras (Ventas por Mes)
  const barChartData = {
    labels: salesPerMonth.map((m: any) => m.month),
    datasets: [{
      label: 'Ventas Totales (Bs)',
      data: salesPerMonth.map((m: any) => m.total),
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 1,
    }]
  };

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">Módulo de Análisis y Rentabilidad</h1>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Ventas Totales</p>
          <p className="text-2xl font-bold text-emerald-400">Bs {Number(summary.totalRevenue).toFixed(2)}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Ganancia Bruta</p>
          <p className="text-2xl font-bold text-indigo-400">Bs {Number(summary.grossProfit).toFixed(2)}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Margen de Ganancia</p>
          <p className="text-2xl font-bold text-amber-400">{summary.profitMargin}%</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Valor Stock Almacén</p>
          <p className="text-2xl font-bold text-blue-400">Bs {Number(summary.totalInventoryValue).toFixed(2)}</p>
        </div>
      </div>

      {/* Gráficos: Torta y Barras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-3 self-start">🏆 Top Productos (Torta)</h3>
          <div className="w-64 h-64 flex items-center justify-center">
            {topProducts.length > 0 ? <Pie data={pieChartData} /> : <p className="text-sm text-gray-400">Sin ventas</p>}
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-3">📊 Ventas Salidas por Mes (Barras)</h3>
          <div className="h-64 flex items-center justify-center">
            {salesPerMonth.length > 0 ? (
              <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            ) : (
              <p className="text-sm text-gray-400">Sin registros mensuales</p>
            )}
          </div>
        </div>
      </div>

      {/* Análisis Inteligente: Qué no comprar / Movimiento Lento & Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recomendaciones de Compras / Exceso */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-3">💡 Inteligencia de Stock (Qué evitar comprar)</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {advancedInsights.map((item: any) => (
              <div key={item.productId} className={`p-2 rounded text-sm border-l-4 ${item.shouldNotBuy ? 'bg-amber-950/40 border-amber-500 text-amber-200' : 'bg-gray-900 border-emerald-500 text-gray-300'}`}>
                <p className="font-semibold">{item.productName}</p>
                <p className="text-xs">Stock actual: {item.totalStock} | Vendidos: {item.totalSold}</p>
                <p className="text-xs italic mt-1 font-medium">{item.recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas de Inventario Crítico */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-3">⚠️ Alertas de Reposición (Stock Mínimo)</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {alerts.length === 0 ? (
              <p className="text-sm text-gray-400">No hay alertas críticas de stock mínimo.</p>
            ) : (
              alerts.map((a: any) => (
                <div key={a.id} className="flex justify-between items-center bg-gray-900 p-2 rounded text-sm border-l-4 border-red-500">
                  <span>{a.product.name}</span>
                  <span className="text-xs text-red-400">Stock actual: {a.currentStock}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}