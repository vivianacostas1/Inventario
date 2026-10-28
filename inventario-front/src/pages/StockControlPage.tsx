import { useEffect, useState } from 'react';
import api from '../api/axios';

interface MonthlySales {
  [monthKey: string]: number;
}

interface ProductStockDetail {
  id: string;
  sku: string;
  name: string;
  imageUrl?: string | null;
  initialStock: number;
  totalSold: number;
  remainingStock: number;
  minStock: number;
  monthlySales: MonthlySales;
}

export const StockControlPage = () => {
  const [data, setData] = useState<ProductStockDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('GLOBAL');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Consultamos en paralelo productos, ventas y el estado actual de stocks
        const [productsRes, salesRes, stocksRes] = await Promise.all([
          api.get('/products').catch(() => ({ data: [] })),
          api.get('/sales').catch(() => ({ data: [] })),
          api.get('/stocks').catch(() => ({ data: [] })),
        ]);

        const products = Array.isArray(productsRes.data) ? productsRes.data : [];
        const sales = Array.isArray(salesRes.data) ? salesRes.data : [];
        const stocksList = Array.isArray(stocksRes.data) ? stocksRes.data : [];

        // 1. Mapear Stock Restante Actual acumulado por producto
        const currentStockMap: Record<string, number> = {};
        stocksList.forEach((s: any) => {
          const pId = s.productId || s.product?.id;
          const qty = Number(s.quantity || 0);
          if (pId) {
            currentStockMap[pId] = (currentStockMap[pId] || 0) + qty;
          }
        });

        // 2. Procesar ventas y consolidar totales y meses
        const monthsSet = new Set<string>();
        const salesByProductAndMonth: Record<string, MonthlySales> = {};
        const totalSalesMap: Record<string, number> = {};

        sales.forEach((sale: any) => {
          if (sale.status !== 'CANCELLED' && sale.status !== 'CANCELADA') {
            const saleDateStr = sale.createdAt || sale.date || new Date().toISOString();
            const date = new Date(saleDateStr);
            const monthNames = [
              'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
              'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];
            const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
            monthsSet.add(monthKey);

            sale.items?.forEach((item: any) => {
              const pId = item.productId || item.product?.id;
              const qty = Number(item.quantity || 0);

              if (pId) {
                totalSalesMap[pId] = (totalSalesMap[pId] || 0) + qty;

                if (!salesByProductAndMonth[pId]) {
                  salesByProductAndMonth[pId] = {};
                }
                salesByProductAndMonth[pId][monthKey] =
                  (salesByProductAndMonth[pId][monthKey] || 0) + qty;
              }
            });
          }
        });

        setAvailableMonths(Array.from(monthsSet));

        // 3. Mapear objeto final
        const processedData: ProductStockDetail[] = products.map((product: any) => {
          const remainingStock = currentStockMap[product.id] ?? Number(product.analytics?.currentStock || 0);
          const totalSold = totalSalesMap[product.id] || 0;
          const initialStock = remainingStock + totalSold;

          return {
            id: product.id,
            sku: product.sku || 'N/A',
            name: product.name || product.nombre || 'Producto sin nombre',
            imageUrl: product.imageUrl,
            initialStock,
            totalSold,
            remainingStock,
            minStock: product.minStock || 0,
            monthlySales: salesByProductAndMonth[product.id] || {},
          };
        });

        setData(processedData);
      } catch (error) {
        console.error('Error al cargar datos de control de stock', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePrintPDF = () => {
    window.print();
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 text-white max-w-7xl mx-auto space-y-6">
      {/* Estilos CSS para el modo impresión PDF */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          aside, nav, header, button, .no-print {
            display: none !important;
          }
          .print-area {
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background-color: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          th, td {
            color: black !important;
            border: 1px solid #cbd5e1 !important;
            padding: 8px !important;
          }
          th {
            background-color: #f1f5f9 !important;
          }
        }
      `}</style>

      {/* Encabezado y Herramientas (Ocultos al imprimir) */}
      <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-indigo-400">Control de Stock e Inventario</h1>
          <p className="text-sm text-gray-300">
            Resumen general de existencias o consulta filtrada por mes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Selector para ver Global o filtrar por Mes */}
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 px-3 py-2 rounded-lg">
            <span className="text-xs text-gray-400 font-medium">Vista:</span>
            <select
              value={selectedMonthFilter}
              onChange={(e) => setSelectedMonthFilter(e.target.value)}
              className="bg-transparent text-sm text-indigo-300 font-medium focus:outline-none cursor-pointer"
            >
              <option value="GLOBAL" className="bg-gray-800 text-white">
                🌐 Vista Global (Todos los tiempos)
              </option>
              {availableMonths.map((month) => (
                <option key={month} value={month} className="bg-gray-800 text-white">
                  📅 Ver sólo {month}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={handlePrintPDF}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-sm transition flex items-center justify-center gap-2 shadow cursor-pointer whitespace-nowrap"
          >
            <span>📄 Exportar PDF</span>
          </button>
        </div>
      </div>

      {/* Tabla Imprimible */}
      <div className="print-area bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-gray-700 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Reporte de Inventario{' '}
              {selectedMonthFilter === 'GLOBAL'
                ? '(Global)'
                : `- ${selectedMonthFilter}`}
            </h2>
            <p className="text-xs text-gray-400">Fecha de emisión: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-700">
                <th className="py-3 px-4">Producto</th>
                <th className="py-3 px-4 text-center">Stock Inicial</th>
                <th className="py-3 px-4 text-center">
                  {selectedMonthFilter === 'GLOBAL' ? 'Total Vendido' : `Ventas en ${selectedMonthFilter}`}
                </th>
                <th className="py-3 px-4 text-center">Stock Restante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400">
                    Cargando inventario...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400">
                    No se encontraron productos coincidentes.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
                  const isLowStock = item.remainingStock <= item.minStock;

                  // Si se selecciona un mes específico, obtenemos el total de ese mes, de lo contrario mostramos el total global
                  const displayedSales =
                    selectedMonthFilter === 'GLOBAL'
                      ? item.totalSold
                      : item.monthlySales[selectedMonthFilter] || 0;

                  return (
                    <tr key={item.id} className="hover:bg-gray-750 transition">
                      <td className="py-3 px-4 flex items-center gap-3">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-9 h-9 object-cover rounded border border-gray-700 no-print"
                          />
                        ) : (
                          <div className="w-9 h-9 bg-gray-900 rounded border border-gray-700 flex items-center justify-center text-gray-500 font-bold text-xs no-print">
                            N/A
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-indigo-300">{item.name}</p>
                          <p className="text-xs text-gray-400">SKU: {item.sku}</p>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="bg-gray-900 px-2.5 py-1 rounded font-mono text-gray-300 border border-gray-700">
                          {item.initialStock}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="bg-blue-950/60 text-blue-400 border border-blue-800/50 px-2.5 py-1 rounded font-mono">
                          {displayedSales}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded font-mono border font-bold ${
                            isLowStock
                              ? 'bg-red-950/60 text-red-400 border-red-800/50'
                              : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50'
                          }`}
                        >
                          {item.remainingStock} un.
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};