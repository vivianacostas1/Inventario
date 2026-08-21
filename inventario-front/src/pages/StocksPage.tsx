import { useState, useEffect } from 'react';
import api from '../api/axios';

export function StocksPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      // Asegúrate de que esta ruta coincida con la que definiste en tu backend
      const res = await api.get('/stocks'); 
      setStocks(res.data);
    } catch (error) {
      console.error("Error al cargar el stock", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Inventario de Stock</h1>
        <p className="text-sm text-gray-400">Estado actual de existencias por almacén.</p>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 text-gray-400 text-sm border-b border-gray-700">
              <th className="p-3">Producto</th>
              <th className="p-3">Almacén</th>
              <th className="p-3 text-center">Cantidad Disponible</th>
              <th className="p-3">Última Actualización</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 text-sm">
            {loading ? (
              <tr><td colSpan={4} className="text-center p-4 text-gray-400">Cargando inventario...</td></tr>
            ) : stocks.length === 0 ? (
              <tr><td colSpan={4} className="text-center p-4 text-gray-400">No hay existencias registradas.</td></tr>
            ) : (
              stocks.map((s) => (
                <tr key={s.id} className="hover:bg-gray-750 transition">
                  <td className="p-3 font-medium text-indigo-300">{s.product?.name || '---'}</td>
                  <td className="p-3 text-gray-300">{s.warehouse?.name || '---'}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded font-bold ${
                      s.quantity > 10 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {s.quantity}
                    </span>
                  </td>
                  <td className="p-3 text-gray-400">
                    {s.updatedAt ? new Date(s.updatedAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}