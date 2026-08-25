"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesProfitView = SalesProfitView;
const react_1 = require("react");
const axios_1 = __importDefault(require("../api/axios"));
function SalesProfitView() {
    const [sales, setSales] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    // Estados para el Modal de Meses, el Mes seleccionado y el desplegable del resumen
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    const [selectedMonth, setSelectedMonth] = (0, react_1.useState)('todos');
    const [isMonthSummaryOpen, setIsMonthSummaryOpen] = (0, react_1.useState)(true);
    // Estados para el Modal de Accionistas
    const [isShareholderModalOpen, setIsShareholderModalOpen] = (0, react_1.useState)(false);
    const [shareholderFinancials, setShareholderFinancials] = (0, react_1.useState)([]);
    const [loadingFinancials, setLoadingFinancials] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        axios_1.default.get('/sales')
            .then(res => {
            setSales(res.data);
            setLoading(false);
        })
            .catch(err => {
            console.error("Error al cargar ventas para el reporte", err);
            setLoading(false);
        });
    }, []);
    // Función para abrir el modal de accionistas y cargar los datos del backend
    const handleOpenShareholderModal = async () => {
        setIsShareholderModalOpen(true);
        setLoadingFinancials(true);
        try {
            const res = await axios_1.default.get('/shareholders/financials');
            setShareholderFinancials(res.data);
        }
        catch (error) {
            console.error("Error al obtener finanzas de accionistas", error);
        }
        finally {
            setLoadingFinancials(false);
        }
    };
    const getUnitCost = (item) => {
        return Number(item.product?.precio_costo ??
            item.product?.costPrice ??
            item.product?.purchasePrice ??
            item.costPrice ??
            item.precio_costo ??
            0);
    };
    const getProductName = (item) => {
        return (item.product?.nombre ??
            item.product?.name ??
            item.nombre ??
            'Producto');
    };
    const calculateItemRevenue = (item) => {
        const salePrice = Number(item.unitPrice || 0);
        const quantity = Number(item.quantity || 0);
        return salePrice * quantity;
    };
    const calculateItemCost = (item) => {
        const costPrice = getUnitCost(item);
        const quantity = Number(item.quantity || 0);
        return costPrice * quantity;
    };
    const calculateItemProfit = (item) => {
        const salePrice = Number(item.unitPrice || 0);
        const costPrice = getUnitCost(item);
        const quantity = Number(item.quantity || 0);
        return (salePrice - costPrice) * quantity;
    };
    // --- AGRUPAR GANANCIAS POR MES ---
    const profitByMonth = sales.reduce((acc, sale) => {
        const saleDateStr = sale.createdAt || sale.date || new Date().toISOString();
        const dateObj = new Date(saleDateStr);
        const year = dateObj.getFullYear();
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const monthKey = `${monthNames[dateObj.getMonth()]} ${year}`;
        let saleRevenue = 0;
        let saleCost = 0;
        let saleProfit = 0;
        sale.items?.forEach((item) => {
            saleRevenue += calculateItemRevenue(item);
            saleCost += calculateItemCost(item);
            saleProfit += calculateItemProfit(item);
        });
        if (!acc[monthKey]) {
            acc[monthKey] = { revenue: 0, cost: 0, profit: 0 };
        }
        acc[monthKey].revenue += saleRevenue;
        acc[monthKey].cost += saleCost;
        acc[monthKey].profit += saleProfit;
        return acc;
    }, {});
    // --- FILTRAR VENTAS SEGÚN EL MES SELECCIONADO ---
    const filteredSales = sales.filter((sale) => {
        if (selectedMonth === 'todos')
            return true;
        const saleDateStr = sale.createdAt || sale.date || new Date().toISOString();
        const dateObj = new Date(saleDateStr);
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const monthKey = `${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
        return monthKey === selectedMonth;
    });
    const totalRevenue = filteredSales.reduce((acc, sale) => {
        const saleTotal = sale.items?.reduce((sum, item) => sum + calculateItemRevenue(item), 0) || 0;
        return acc + saleTotal;
    }, 0);
    const totalProfit = filteredSales.reduce((acc, sale) => {
        const saleProfit = sale.items?.reduce((sum, item) => sum + calculateItemProfit(item), 0) || 0;
        return acc + saleProfit;
    }, 0);
    const filteredMonths = selectedMonth === 'todos'
        ? Object.entries(profitByMonth)
        : Object.entries(profitByMonth).filter(([month]) => month === selectedMonth);
    if (loading) {
        return <div className="text-white p-6">Cargando reporte de ganancias...</div>;
    }
    return (<div className="p-6 text-white max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">📊 Reporte de Ventas y Ganancias</h2>
        
        <div className="flex items-center gap-3">
          {/* Botón para ver Ganancias por Accionista */}
          <button onClick={handleOpenShareholderModal} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium shadow transition flex items-center gap-2 text-sm">
            👥 Ganancias por Accionista
          </button>

          {/* Botón para abrir el Modal de Selección de Mes */}
          <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium shadow transition flex items-center gap-2 text-sm">
            📅 Filtrar por Mes {selectedMonth !== 'todos' && `(${selectedMonth})`}
          </button>
        </div>
      </div>

      {/* Tarjetas de Resumen Global */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 border border-gray-700 p-5 rounded-lg shadow-md">
          <p className="text-sm text-gray-400">Ventas Totales (Ingresos) {selectedMonth !== 'todos' && `- ${selectedMonth}`}</p>
          <p className="text-3xl font-bold text-emerald-400 mt-1">Bs {totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 p-5 rounded-lg shadow-md">
          <p className="text-sm text-gray-400">Ganancia Neta Real {selectedMonth !== 'todos' && `- ${selectedMonth}`}</p>
          <p className="text-3xl font-bold text-indigo-400 mt-1">Bs {totalProfit.toFixed(2)}</p>
        </div>
      </div>

      {/* Resumen por Mes (Desplegable) */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center font-semibold cursor-pointer hover:bg-gray-750 transition" onClick={() => setIsMonthSummaryOpen(!isMonthSummaryOpen)}>
          <div className="flex items-center gap-2">
            <span>Resumen de Ganancias por Mes</span>
            <span className="text-xs text-gray-400">
              {isMonthSummaryOpen ? '▼' : '▶'}
            </span>
          </div>

          {selectedMonth !== 'todos' && (<button onClick={(e) => { e.stopPropagation(); setSelectedMonth('todos'); }} className="text-xs text-indigo-400 hover:underline">
              Ver todos los meses
            </button>)}
        </div>

        {isMonthSummaryOpen && (<div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-900 text-gray-400 border-b border-gray-700">
                  <th className="p-3">Mes / Periodo</th>
                  <th className="p-3 text-right">Ingresos Totales</th>
                  <th className="p-3 text-right">Costos Totales</th>
                  <th className="p-3 text-right">Ganancia Neta Mensual</th>
                </tr>
              </thead>
              <tbody>
                {filteredMonths.length > 0 ? (filteredMonths.map(([month, data]) => (<tr key={month} className="border-b border-gray-700/50 hover:bg-gray-750">
                      <td className="p-3 font-medium text-indigo-300">{month}</td>
                      <td className="p-3 text-right text-emerald-400">Bs {data.revenue.toFixed(2)}</td>
                      <td className="p-3 text-right text-amber-400">Bs {data.cost.toFixed(2)}</td>
                      <td className="p-3 text-right font-bold text-indigo-400">Bs {data.profit.toFixed(2)}</td>
                    </tr>))) : (<tr>
                    <td colSpan={4} className="p-4 text-center text-gray-400">No hay datos para el mes seleccionado.</td>
                  </tr>)}
              </tbody>
            </table>
          </div>)}
      </div>

      {/* Tabla detallada de Productos Vendidos */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-700 font-semibold">
          Detalle de Márgenes por Producto Vendido {selectedMonth !== 'todos' && `(${selectedMonth})`}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-900 text-gray-400 border-b border-gray-700">
                <th className="p-3">ID Venta</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Producto (Cant.)</th>
                <th className="p-3 text-right">Precio Compra (Costo)</th>
                <th className="p-3 text-right">Precio Venta</th>
                <th className="p-3 text-right">Ganancia Neta</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length > 0 ? (filteredSales.map((sale) => {
            return sale.items?.map((item, idx) => {
                const unitSalePrice = Number(item.unitPrice || 0);
                const unitCostPrice = getUnitCost(item);
                const quantity = Number(item.quantity || 0);
                const itemProfit = (unitSalePrice - unitCostPrice) * quantity;
                const productName = getProductName(item);
                return (<tr key={`${sale.id}-${idx}`} className="border-b border-gray-700/50 hover:bg-gray-750">
                        <td className="p-3 font-mono text-xs text-gray-400">{sale.id.slice(0, 8)}...</td>
                        <td className="p-3">{sale.customer?.name || sale.client?.name || 'Cliente general'}</td>
                        <td className="p-3 text-gray-200">
                          {productName} <span className="text-gray-400 text-xs">(x{quantity})</span>
                        </td>
                        <td className="p-3 text-right text-amber-400">
                          Bs {(unitCostPrice * quantity).toFixed(2)} <span className="text-xs text-gray-500">(Bs {unitCostPrice.toFixed(2)} c/u)</span>
                        </td>
                        <td className="p-3 text-right text-emerald-400">
                          Bs {(unitSalePrice * quantity).toFixed(2)} <span className="text-xs text-gray-500">(Bs {unitSalePrice.toFixed(2)} c/u)</span>
                        </td>
                        <td className="p-3 text-right font-bold text-indigo-400">Bs {itemProfit.toFixed(2)}</td>
                      </tr>);
            });
        })) : (<tr>
                  <td colSpan={6} className="p-4 text-center text-gray-400">No hay ventas registradas para este periodo.</td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL DE SELECCIÓN DE MES --- */}
      {isModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-700 w-full max-w-md rounded-xl p-6 shadow-2xl text-white space-y-4">
            <h3 className="text-lg font-bold">Seleccionar Mes a Consultar</h3>
            <p className="text-sm text-gray-400">Elige un mes de la lista para filtrar el resumen o muestra todos:</p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              <button onClick={() => { setSelectedMonth('todos'); setIsModalOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-lg border transition ${selectedMonth === 'todos' ? 'bg-indigo-600 border-indigo-500 font-semibold' : 'bg-gray-800 border-gray-700 hover:bg-gray-750'}`}>
                🌐 Mostrar Todos los Meses
              </button>

              {Object.keys(profitByMonth).map((month) => (<button key={month} onClick={() => { setSelectedMonth(month); setIsModalOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-lg border transition ${selectedMonth === month ? 'bg-indigo-600 border-indigo-500 font-semibold' : 'bg-gray-800 border-gray-700 hover:bg-gray-750'}`}>
                  📅 {month}
                </button>))}
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition">
                Cerrar
              </button>
            </div>
          </div>
        </div>)}

      {/* --- MODAL DE GANANCIAS POR ACCIONISTA --- */}
      {isShareholderModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-700 w-full max-w-6xl rounded-xl p-6 shadow-2xl text-white space-y-6">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="text-xl font-bold flex items-center gap-2">👥 Resumen Financiero por Accionista</h3>
              <button onClick={() => setIsShareholderModalOpen(false)} className="text-gray-400 hover:text-white font-bold text-lg">
                ✕
              </button>
            </div>

            {loadingFinancials ? (<div className="py-12 text-center text-gray-400">Calculando capital y ganancias de accionistas...</div>) : (<div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-800 text-gray-400 border-b border-gray-700">
                      <th className="p-3">Accionista</th>
                      <th className="p-3 text-center">% Participación</th>
                      <th className="p-3 text-right">Capital Invertido</th>
                      <th className="p-3 text-right">Ventas de sus Productos</th>
                      <th className="p-3 text-right">Ganancia Obtenida</th>
                      <th className="p-3 text-right text-cyan-300">Ventas + Ganancia</th>
                      <th className="p-3 text-right font-bold text-emerald-300">Total a Devolver</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shareholderFinancials.length > 0 ? (shareholderFinancials.map((sh) => {
                    const totalDevolucion = sh.investmentAmount + sh.netProfit;
                    return (<tr key={sh.id} className="border-b border-gray-800 hover:bg-gray-850">
                            <td className="p-3 font-medium text-white">{sh.name}</td>
                            <td className="p-3 text-center text-indigo-300">{sh.sharePercentage}%</td>
                            <td className="p-3 text-right text-amber-400">Bs {sh.investmentAmount.toFixed(2)}</td>
                            <td className="p-3 text-right text-sky-400">Bs {(sh.productSalesTotal || 0).toFixed(2)}</td>
                            <td className="p-3 text-right text-indigo-400">Bs {sh.netProfit.toFixed(2)}</td>
                            
                            <td className="p-3 text-right text-cyan-400 font-semibold">Bs {(((sh.productSalesTotal || 0) - (sh.netProfit || 0)) + (sh.netProfit || 0)).toFixed(2)}</td>
                            <td className="p-3 text-right font-bold text-emerald-400">Bs {totalDevolucion.toFixed(2)}</td>
                          </tr>);
                })) : (<tr>
                        <td colSpan={7} className="p-6 text-center text-gray-400">No hay accionistas registrados o activos.</td>
                      </tr>)}
                  </tbody>
                </table>
              </div>)}

            <div className="flex justify-end pt-2">
              <button onClick={() => setIsShareholderModalOpen(false)} className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg text-sm transition font-medium">
                Cerrar
              </button>
            </div>
          </div>
        </div>)}
    </div>);
}
