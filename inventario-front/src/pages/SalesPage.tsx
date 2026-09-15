import { useState, useEffect } from 'react';
import api from '../api/axios';
import { SaleModal } from './SaleModal';

export function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await api.get('/sales');
      setSales(response.data);
    } catch (error) {
      console.error("Error al cargar las ventas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Filtrar ventas
  const filteredSales = sales.filter((sale: any) => {
    const searchLower = searchTerm.toLowerCase();

    const matchesItem = sale.items?.some((item: any) => {
      const productName = (item.product?.name || '').toLowerCase();
      const shareholderName = (item.shareholder?.name || '').toLowerCase();
      const quantityStr = String(item.quantity || '');

      return (
        productName.includes(searchLower) ||
        shareholderName.includes(searchLower) ||
        quantityStr.includes(searchLower)
      );
    });

    const clientName = (
      sale.customer?.name || 'cliente general'
    ).toLowerCase();

    const status = (sale.status || '').toLowerCase();

    return (
      matchesItem ||
      clientName.includes(searchLower) ||
      status.includes(searchLower)
    );
  });

  // Total de páginas
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

  // Índices de los elementos que se muestran
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Ventas de la página actual
  const paginatedSales = filteredSales.slice(startIndex, endIndex);

  // Cambiar página
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Cuando cambia el buscador, volver a la primera página
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">

      {/* Cabecera */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Gestión de Ventas
          </h1>
          <p className="text-gray-400">
            Historial de transacciones y salida de productos.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 shadow-lg"
        >
          + Nueva Venta
        </button>
      </div>

      {/* Barra de Búsqueda */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por accionista, producto o cantidad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
        />
      </div>

      {/* Tabla de Ventas */}
      <div className="bg-slate-800/80 rounded-xl border border-slate-700 shadow-xl overflow-x-auto">
        <table className="w-full text-left border-collapse">

          <thead>
            <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-4">Fecha</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Total ($)</th>
              <th className="p-4">Registrado por</th>
              <th className="p-4">Productos y Accionista</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-700/50 text-sm">

            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-slate-400"
                >
                  Cargando ventas...
                </td>
              </tr>
            ) : paginatedSales.length > 0 ? (

              paginatedSales.map((sale: any) => {
                const items = sale.items || [];
                const clientName =
                  sale.customer?.name || 'Cliente General';
                const userName =
                  sale.user?.name || 'Usuario Sistema';

                return (
                  <tr
                    key={sale.id}
                    className="hover:bg-slate-700/40 transition"
                  >
                    <td className="p-4 text-slate-300">
                      {sale.createdAt
                        ? new Date(
                            sale.createdAt
                          ).toLocaleDateString()
                        : 'N/A'}
                    </td>

                    <td className="p-4 font-medium">
                      {clientName}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                          sale.status === 'COMPLETED'
                            ? 'bg-emerald-900/70 text-emerald-300 border border-emerald-700'
                            : sale.status === 'PENDING'
                            ? 'bg-amber-900/70 text-amber-300 border border-amber-700'
                            : 'bg-rose-900/70 text-rose-300 border border-rose-700'
                        }`}
                      >
                        {sale.status || 'COMPLETED'}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-emerald-400">
                      ${Number(sale.totalAmount || 0).toFixed(2)}
                    </td>

                    <td className="p-4 text-slate-300">
                      {userName}
                    </td>

                    <td className="p-4 text-xs">
                      {items.length > 0 ? (
                        <ul className="space-y-1">
                          {items.map((item: any, idx: number) => {
                            const itemShareholder =
                              item.shareholder?.name ||
                              'Sin Accionista';

                            return (
                              <li
                                key={idx}
                                className="text-slate-300 border-b border-slate-700/30 pb-1 last:border-0"
                              >
                                <div>
                                  <span className="font-medium text-emerald-300">
                                    {item.product?.name || 'Producto'}:
                                  </span>{' '}
                                  {item.quantity} un. @ $
                                  {Number(item.unitPrice).toFixed(2)}
                                </div>

                                <div className="text-indigo-400 text-[11px]">
                                  Accionista: {itemShareholder}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <span className="text-slate-500 italic">
                          Sin ítems
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })

            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-slate-400 italic"
                >
                  No se encontraron ventas coincidentes.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {!loading && filteredSales.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-5">

          {/* Información */}
          <div className="text-sm text-slate-400">
            Mostrando{' '}
            <span className="text-white font-medium">
              {startIndex + 1}
            </span>{' '}
            -{' '}
            <span className="text-white font-medium">
              {Math.min(endIndex, filteredSales.length)}
            </span>{' '}
            de{' '}
            <span className="text-white font-medium">
              {filteredSales.length}
            </span>{' '}
            ventas
          </div>

          <div className="flex items-center gap-2">

            {/* Registros por página */}
            <select
              value={itemsPerPage}
              onChange={(e) =>
                setItemsPerPage(Number(e.target.value))
              }
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
              <option value={50}>50 por página</option>
            </select>

            {/* Anterior */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-sm hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              ←
            </button>

            {/* Números de página */}
            <div className="flex items-center gap-1">
              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`min-w-[38px] px-3 py-2 rounded-lg text-sm transition ${
                    currentPage === page
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Siguiente */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-sm hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              →
            </button>

          </div>
        </div>
      )}

      {/* Modal para Nueva Venta */}
      {isModalOpen && (
        <SaleModal
          onClose={() => setIsModalOpen(false)}
          onSaleSuccess={() => {
            fetchSales();
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
