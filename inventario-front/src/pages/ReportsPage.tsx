import { useState, useEffect } from 'react';
import api from '../api/axios';

export function ReportsPage() {
  const [shareholdersData, setShareholdersData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/shareholders');
      setShareholdersData(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al cargar los datos del reporte de accionistas", error);
      setShareholdersData([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const num = (val: any) => {
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  };

  const filteredShareholders = shareholdersData.map((sh) => {
    const search = (searchTerm || '').toLowerCase();
    const shareholderName = (sh?.name || '').toLowerCase();
    
    const productsList = Array.isArray(sh?.shareholderProducts) 
      ? sh.shareholderProducts 
      : [];

    const filteredProducts = productsList.filter((sp: any) => {
      const productName = (sp?.product?.name || '').toLowerCase();
      return shareholderName.includes(search) || productName.includes(search);
    });

    return {
      ...sh,
      filteredProducts
    };
  }).filter(sh => {
    const search = (searchTerm || '').toLowerCase();
    const shareholderName = (sh?.name || '').toLowerCase();
    return shareholderName.includes(search) || (sh?.filteredProducts && sh.filteredProducts.length > 0);
  });

  return (
    <div className="p-6 text-white max-w-7xl mx-auto">
      <style>{`
        @media print {
          body { background-color: white !important; color: black !important; }
          aside, nav, header, button, .no-print { display: none !important; }
          .print-container { width: 100% !important; padding: 0 !important; margin: 0 !important; box-shadow: none !important; }
          table { width: 100% !important; border-collapse: collapse !important; }
          th, td { color: black !important; border: 1px solid #cbd5e1 !important; padding: 6px !important; }
          th { background-color: #f1f5f9 !important; }
        }
      `}</style>

      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-indigo-400">Reporte económico según inversión</h1>
          <p className="text-sm text-gray-400">Capital invertido, stock restante y ganancia esperada según precio de venta.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar por accionista o producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition text-sm"
          />
          
          <button
            onClick={handlePrintPDF}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition text-sm shadow whitespace-nowrap flex items-center gap-2 cursor-pointer"
          >
            <span>📄 Descargar PDF</span>
          </button>
        </div>
      </div>

      <div className="print-container space-y-8">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Calculando reporte económico...</div>
        ) : filteredShareholders.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-gray-800 rounded-lg border border-gray-700">
            No se encontraron accionistas o productos registrados.
          </div>
        ) : (
          filteredShareholders.map((sh) => {
            let totalCapitalInvertido = 0;
            let totalGananciaEsperada = 0;

            const productsList = sh.filteredProducts || [];

            productsList.forEach((sp: any) => {
              const cantidad = num(sp?.quantity);
              const costoUnitario = num(sp?.product?.costPrice);
              const precioVenta = num(sp?.product?.unitPrice);

              totalCapitalInvertido += cantidad * costoUnitario;
              totalGananciaEsperada += cantidad * (precioVenta - costoUnitario);
            });

            return (
              <div key={sh?.id || Math.random()} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 mb-4 border-b border-gray-700 gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <span>👤</span> {sh?.name || 'Accionista sin nombre'}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">Correo: {sh?.email || 'No registrado'} | Teléfono: {sh?.phone || 'N/A'}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    <div className="bg-gray-900/80 px-4 py-2 rounded-lg border border-gray-700 flex-1 md:flex-none">
                      <p className="text-[11px] text-gray-400 uppercase tracking-wider">Capital Invertido</p>
                      <p className="text-base font-bold text-amber-400">
                        ${totalCapitalInvertido.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="bg-gray-900/80 px-4 py-2 rounded-lg border border-gray-700 flex-1 md:flex-none">
                      <p className="text-[11px] text-gray-400 uppercase tracking-wider">Ganancia Esperada</p>
                      <p className="text-base font-bold text-emerald-400">
                        ${totalGananciaEsperada.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-900 text-gray-400 border-b border-gray-700 text-xs">
                        <th className="p-3">Producto</th>
                        <th className="p-3 text-center">Stock Restante</th>
                        <th className="p-3 text-right">Costo Unit.</th>
                        <th className="p-3 text-right">Precio Venta</th>
                        <th className="p-3 text-right">Inversión Total</th>
                        <th className="p-3 text-right">Ganancia Est.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {productsList.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-4 text-gray-500 text-xs italic">
                            Este accionista no tiene productos asignados.
                          </td>
                        </tr>
                      ) : (
                        productsList.map((sp: any, idx: number) => {
                          const cant = num(sp?.quantity);
                          const costo = num(sp?.product?.costPrice);
                          const venta = num(sp?.product?.unitPrice);
                          const inversionProd = cant * costo;
                          const gananciaProd = cant * (venta - costo);

                          return (
                            <tr key={idx} className="hover:bg-gray-750 transition">
                              <td className="p-3 font-medium text-gray-200">{sp?.product?.name || 'Producto sin nombre'}</td>
                              <td className="p-3 text-center">
                                <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-bold border border-indigo-900 text-xs">
                                  {cant} un.
                                </span>
                              </td>
                              <td className="p-3 text-right text-gray-300">${costo.toFixed(2)}</td>
                              <td className="p-3 text-right text-gray-300">${venta.toFixed(2)}</td>
                              <td className="p-3 text-right text-amber-300 font-medium">${inversionProd.toFixed(2)}</td>
                              <td className="p-3 text-right text-emerald-400 font-medium">${gananciaProd.toFixed(2)}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}