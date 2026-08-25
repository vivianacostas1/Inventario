"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockMovementsPage = StockMovementsPage;
const react_1 = require("react");
const axios_1 = __importDefault(require("../api/axios"));
function StockMovementsPage() {
    const [movements, setMovements] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [filterType, setFilterType] = (0, react_1.useState)('ALL');
    (0, react_1.useEffect)(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            setLoading(true);
            const movRes = await axios_1.default.get('/stock-movements');
            setMovements(movRes.data);
        }
        catch (error) {
            console.error("Error al cargar movimientos", error);
        }
        finally {
            setLoading(false);
        }
    };
    // Filtrar los movimientos según la pestaña seleccionada
    const filteredMovements = movements.filter((m) => {
        if (filterType === 'ALL')
            return true;
        return m.type === filterType;
    });
    return (<div className="p-6 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Movimientos de Stock</h1>
          <p className="text-sm text-gray-400">Historial automatizado de entradas y salidas en los almacenes.</p>
        </div>

        {/* Botones de Filtro (Tabs) para separar IN y OUT */}
        <div className="flex bg-gray-900 p-1 rounded-lg border border-gray-700">
          <button onClick={() => setFilterType('ALL')} className={`px-4 py-1.5 rounded text-sm font-semibold transition ${filterType === 'ALL' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>
            Todos ({movements.length})
          </button>
          <button onClick={() => setFilterType('IN')} className={`px-4 py-1.5 rounded text-sm font-semibold transition ${filterType === 'IN' ? 'bg-emerald-900 text-emerald-300' : 'text-gray-400 hover:text-white'}`}>
            Entradas (IN)
          </button>
          <button onClick={() => setFilterType('OUT')} className={`px-4 py-1.5 rounded text-sm font-semibold transition ${filterType === 'OUT' ? 'bg-rose-900 text-rose-300' : 'text-gray-400 hover:text-white'}`}>
            Salidas (OUT)
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 text-gray-400 text-sm border-b border-gray-700">
              <th className="p-3">Fecha</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Producto</th>
              <th className="p-3">Almacén</th>
              <th className="p-3 text-center">Cantidad</th>
              <th className="p-3">Motivo / Razón</th>
              <th className="p-3">Usuario</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 text-sm">
            {loading ? (<tr><td colSpan={7} className="text-center p-4 text-gray-400">Cargando movimientos...</td></tr>) : filteredMovements.length === 0 ? (<tr><td colSpan={7} className="text-center p-4 text-gray-400">No hay movimientos registrados para este filtro.</td></tr>) : (filteredMovements.map((m) => (<tr key={m.id} className="hover:bg-gray-750 transition">
                  <td className="p-3 text-gray-300">{new Date(m.createdAt).toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${m.type === 'IN' ? 'bg-emerald-900 text-emerald-300' : 'bg-rose-900 text-rose-300'}`}>
                      {m.type}
                    </span>
                  </td>
                  <td className="p-3 font-medium">{m.product?.name}</td>
                  <td className="p-3 text-gray-300">{m.warehouse?.name}</td>
                  <td className="p-3 text-center font-bold">{m.quantity}</td>
                  <td className="p-3 text-gray-400">{m.reason || 'Sin motivo especificado'}</td>
                  <td className="p-3 text-gray-400">{m.user?.name || 'Sistema'}</td>
                </tr>)))}
          </tbody>
        </table>
      </div>
    </div>);
}
