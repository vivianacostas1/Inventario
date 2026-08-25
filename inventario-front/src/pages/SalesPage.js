"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesPage = SalesPage;
const react_1 = require("react");
const axios_1 = __importDefault(require("../api/axios"));
const SaleModal_1 = require("./SaleModal");
function SalesPage() {
    const [sales, setSales] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    const fetchSales = async () => {
        try {
            setLoading(true);
            const response = await axios_1.default.get('/sales');
            setSales(response.data);
        }
        catch (error) {
            console.error("Error al cargar las ventas", error);
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        fetchSales();
    }, []);
    return (<div className="p-8 max-w-7xl mx-auto text-white">
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Ventas</h1>
          <p className="text-gray-400">Historial de transacciones y salida de productos.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 shadow-lg">
          + Nueva Venta
        </button>
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
              <th className="p-4">Productos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50 text-sm">
            {loading ? (<tr>
                <td colSpan={6} className="p-6 text-center text-slate-400">Cargando ventas...</td>
              </tr>) : sales.length > 0 ? (sales.map((sale) => {
            const items = sale.items || [];
            const clientName = sale.customer?.name || 'Cliente General';
            const userName = sale.user?.name || 'Usuario Sistema';
            return (<tr key={sale.id} className="hover:bg-slate-700/40 transition">
                    <td className="p-4 text-slate-300">
                      {sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 font-medium">{clientName}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${sale.status === 'COMPLETED' ? 'bg-emerald-900/70 text-emerald-300 border border-emerald-700' :
                    sale.status === 'PENDING' ? 'bg-amber-900/70 text-amber-300 border border-amber-700' :
                        'bg-rose-900/70 text-rose-300 border border-rose-700'}`}>
                        {sale.status || 'COMPLETED'}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-emerald-400">
                      ${Number(sale.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="p-4 text-slate-300">{userName}</td>
                    <td className="p-4 text-xs">
                      {items.length > 0 ? (<ul className="space-y-0.5">
                          {items.map((item, idx) => (<li key={idx} className="text-slate-300">
                              <span className="font-medium text-emerald-300">
                                {item.product?.name || 'Producto'}:
                              </span> {item.quantity} un. @ ${Number(item.unitPrice).toFixed(2)}
                            </li>))}
                        </ul>) : (<span className="text-slate-500 italic">Sin ítems</span>)}
                    </td>
                  </tr>);
        })) : (<tr>
                <td colSpan={6} className="p-6 text-center text-slate-400 italic">No hay ventas registradas.</td>
              </tr>)}
          </tbody>
        </table>
      </div>

      {/* Modal para Nueva Venta */}
      {isModalOpen && (<SaleModal_1.SaleModal onClose={() => setIsModalOpen(false)} onSaleSuccess={() => {
                fetchSales();
                setIsModalOpen(false);
            }}/>)}
    </div>);
}
