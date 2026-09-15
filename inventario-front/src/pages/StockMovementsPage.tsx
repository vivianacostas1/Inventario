import { useState, useEffect } from 'react';
import api from '../api/axios';

export function StockMovementsPage() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'ALL' | 'IN' | 'OUT'>('ALL');

  // Buscador
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const movRes = await api.get('/stock-movements');

      setMovements(
        Array.isArray(movRes.data)
          ? movRes.data
          : movRes.data?.data || []
      );

    } catch (error) {
      console.error(
        "Error al cargar movimientos",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILTRAR MOVIMIENTOS
  // ==========================================

  const filteredMovements = movements.filter((m) => {
    // Filtro por tipo
    const matchesType =
      filterType === 'ALL' ||
      m.type === filterType;

    if (!matchesType) {
      return false;
    }

    // Filtro por buscador
    const term = searchTerm
      .toLowerCase()
      .trim();

    // Si no hay texto de búsqueda,
    // solamente aplicamos el filtro de tipo.
    if (!term) {
      return true;
    }

    const productName = (
      m.product?.name || ''
    ).toLowerCase();

    const warehouseName = (
      m.warehouse?.name || ''
    ).toLowerCase();

    const userName = (
      m.user?.name || ''
    ).toLowerCase();

    const reason = (
      m.reason || ''
    ).toLowerCase();

    const type = (
      m.type || ''
    ).toLowerCase();

    const quantity = String(
      m.quantity || ''
    ).toLowerCase();

    // Fecha formateada para poder buscar
    // también por fecha.
    const date = m.createdAt
      ? new Date(m.createdAt)
          .toLocaleString()
          .toLowerCase()
      : '';

    return (
      productName.includes(term) ||
      warehouseName.includes(term) ||
      userName.includes(term) ||
      reason.includes(term) ||
      type.includes(term) ||
      quantity.includes(term) ||
      date.includes(term)
    );
  });

  return (
    <div className="p-6 text-white">

      {/* ======================================
          CABECERA
      ======================================= */}

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">

        {/* TÍTULO */}

        <div>
          <h1 className="text-2xl font-bold">
            Movimientos de Stock
          </h1>

          <p className="text-sm text-gray-400">
            Historial automatizado de entradas y
            salidas en los almacenes.
          </p>
        </div>

        {/* CONTROLES */}

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full xl:w-auto">

          {/* BUSCADOR */}

          <div className="relative w-full lg:w-80">

            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Buscar producto, almacén, usuario..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition"
            />

            {/* BOTÓN PARA LIMPIAR */}

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}

          </div>

          {/* BOTONES DE FILTRO */}

          <div className="flex bg-gray-900 p-1 rounded-lg border border-gray-700">

            <button
              onClick={() =>
                setFilterType('ALL')
              }
              className={`px-4 py-1.5 rounded text-sm font-semibold transition ${
                filterType === 'ALL'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Todos ({movements.length})
            </button>

            <button
              onClick={() =>
                setFilterType('IN')
              }
              className={`px-4 py-1.5 rounded text-sm font-semibold transition ${
                filterType === 'IN'
                  ? 'bg-emerald-900 text-emerald-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Entradas (
              {
                movements.filter(
                  (m) => m.type === 'IN'
                ).length
              }
              )
            </button>

            <button
              onClick={() =>
                setFilterType('OUT')
              }
              className={`px-4 py-1.5 rounded text-sm font-semibold transition ${
                filterType === 'OUT'
                  ? 'bg-rose-900 text-rose-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Salidas (
              {
                movements.filter(
                  (m) => m.type === 'OUT'
                ).length
              }
              )
            </button>

          </div>

        </div>

      </div>

      {/* ======================================
          RESULTADO DEL BUSCADOR
      ======================================= */}

      {searchTerm && !loading && (
        <div className="mb-4 text-sm text-gray-400">
          Se encontraron{' '}
          <span className="text-white font-semibold">
            {filteredMovements.length}
          </span>{' '}
          movimientos para{' '}
          <span className="text-indigo-400 font-semibold">
            "{searchTerm}"
          </span>
        </div>
      )}

      {/* ======================================
          TABLA
      ======================================= */}

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-x-auto shadow-lg">

        <table className="w-full text-left border-collapse">

          <thead>
            <tr className="bg-gray-900 text-gray-400 text-sm border-b border-gray-700">

              <th className="p-3">
                Fecha
              </th>

              <th className="p-3">
                Tipo
              </th>

              <th className="p-3">
                Producto
              </th>

              <th className="p-3">
                Almacén
              </th>

              <th className="p-3 text-center">
                Cantidad
              </th>

              <th className="p-3">
                Motivo / Razón
              </th>

              <th className="p-3">
                Usuario
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700 text-sm">

            {/* CARGANDO */}

            {loading ? (

              <tr>
                <td
                  colSpan={7}
                  className="text-center p-4 text-gray-400"
                >
                  Cargando movimientos...
                </td>
              </tr>

            ) : filteredMovements.length === 0 ? (

              /* SIN RESULTADOS */

              <tr>
                <td
                  colSpan={7}
                  className="text-center p-6 text-gray-400"
                >
                  {searchTerm
                    ? 'No se encontraron movimientos que coincidan con la búsqueda.'
                    : 'No hay movimientos registrados para este filtro.'}
                </td>
              </tr>

            ) : (

              /* RESULTADOS */

              filteredMovements.map((m) => (

                <tr
                  key={m.id}
                  className="hover:bg-gray-750 transition"
                >

                  {/* FECHA */}

                  <td className="p-3 text-gray-300 whitespace-nowrap">
                    {m.createdAt
                      ? new Date(
                          m.createdAt
                        ).toLocaleString()
                      : 'N/A'}
                  </td>

                  {/* TIPO */}

                  <td className="p-3">

                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        m.type === 'IN'
                          ? 'bg-emerald-900 text-emerald-300'
                          : 'bg-rose-900 text-rose-300'
                      }`}
                    >
                      {m.type}
                    </span>

                  </td>

                  {/* PRODUCTO */}

                  <td className="p-3 font-medium">
                    {m.product?.name ||
                      'Producto desconocido'}
                  </td>

                  {/* ALMACÉN */}

                  <td className="p-3 text-gray-300">
                    {m.warehouse?.name ||
                      'Almacén desconocido'}
                  </td>

                  {/* CANTIDAD */}

                  <td className="p-3 text-center font-bold">
                    {m.quantity}
                  </td>

                  {/* MOTIVO */}

                  <td className="p-3 text-gray-400">
                    {m.reason ||
                      'Sin motivo especificado'}
                  </td>

                  {/* USUARIO */}

                  <td className="p-3 text-gray-400">
                    {m.user?.name ||
                      'Sistema'}
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
