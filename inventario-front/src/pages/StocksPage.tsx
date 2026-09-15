import { useState, useEffect } from 'react';
import api from '../api/axios';

export function StocksPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/stocks'); 
      setStocks(res.data);
    } catch (error) {
      console.error("Error al cargar el stock", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrintPDF = () => {
    // Al imprimir, expandimos temporalmente todas las filas para que el PDF salga completo con los accionistas visibles
    const allExpanded: Record<string, boolean> = {};
    stocks.forEach(s => { allExpanded[s.id] = true; });
    setExpandedRows(allExpanded);

    setTimeout(() => {
      window.print();
    }, 100);
  };

  const filteredStocks = stocks.filter((s) => {
    const search = searchTerm.toLowerCase();
    const productName = (s.product?.name || '').toLowerCase();
    const warehouseName = (s.warehouse?.name || '').toLowerCase();
    
    const matchesShareholder = s.product?.shareholderProducts?.some((sp: any) => 
      (sp.shareholder?.name || '').toLowerCase().includes(search)
    );

    return (
      productName.includes(search) ||
      warehouseName.includes(search) ||
      matchesShareholder
    );
  });

  return (
    <div className="p-6 text-white max-w-7xl mx-auto">
      {/* Estilos CSS específicos para ocultar elementos de navegación al imprimir */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          aside, nav, header, button, .no-print {
            display: none !important;
          }
          .print-container {
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
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

      {/* Cabecera y Controles (Se ocultan automáticamente al imprimir) */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold">Inventario de Stock por Accionista</h1>
          <p className="text-sm text-gray-400">Distribución exacta de existencias asignadas a cada accionista en almacén.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar por producto, almacén o accionista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-72 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition text-sm"
          />
          
          <button
            onClick={handlePrintPDF}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition text-sm shadow whitespace-nowrap flex items-center gap-2 cursor-pointer"
          >
            <span>📄 Exportar PDF</span>
          </button>
        </div>
      </div>

      {/* Contenedor de la Grilla */}
      <div className="print-container bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 text-gray-400 text-sm border-b border-gray-700">
              <th className="p-3">Producto</th>
              <th className="p-3">Almacén</th>
              <th className="p-3 text-center">Stock Total</th>
              <th className="p-3">Accionistas</th>
              <th className="p-3">Última Actualización</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 text-sm">
            {loading ? (
              <tr><td colSpan={5} className="text-center p-4 text-gray-400">Cargando inventario...</td></tr>
            ) : filteredStocks.length === 0 ? (
              <tr><td colSpan={5} className="text-center p-4 text-gray-400">No se encontraron existencias coincidentes.</td></tr>
            ) : (
              filteredStocks.map((s) => {
                const shareholderProducts = s.product?.shareholderProducts || [];
                const isExpanded = !!expandedRows[s.id];

                return (
                  <tr key={s.id} className="hover:bg-gray-750 transition align-top">
                    <td className="p-3 font-medium text-indigo-300">{s.product?.name || '---'}</td>
                    <td className="p-3 text-gray-300">{s.warehouse?.name || '---'}</td>
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-1 rounded-md bg-gray-900 text-emerald-400 font-bold border border-emerald-900/50">
                        {s.quantity} un.
                      </span>
                    </td>
                    <td className="p-3">
                      {shareholderProducts.length > 0 ? (
                        <div>
                          <button
                            onClick={() => toggleRow(s.id)}
                            className="no-print flex items-center justify-between w-full bg-gray-900 hover:bg-gray-700 px-3 py-1.5 rounded border border-gray-700 text-xs font-medium text-gray-200 transition"
                          >
                            <span>
                              {shareholderProducts.length} {shareholderProducts.length === 1 ? 'Accionista' : 'Accionistas'}
                            </span>
                            <span className="text-indigo-400 font-bold ml-2">
                              {isExpanded ? '▲ Ocultar' : '▼ Ver detalles'}
                            </span>
                          </button>

                          {/* En pantalla se muestra desplegable; al imprimir se muestran fijos */}
                          {isExpanded && (
                            <div className="mt-2 space-y-1.5 bg-gray-950/60 p-2 rounded border border-gray-800">
                              {shareholderProducts.map((sp: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center px-2 py-1 rounded bg-gray-900/90 text-xs">
                                  <span className="text-gray-300 truncate mr-2">
                                    {sp.shareholder?.name || 'Accionista'}
                                  </span>
                                  <span className="bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded font-bold border border-indigo-800 shrink-0">
                                    {sp.quantity} un.
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 italic text-xs">Sin accionistas</span>
                      )}
                    </td>
                    <td className="p-3 text-gray-400 text-xs">
                      {s.updatedAt ? new Date(s.updatedAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}