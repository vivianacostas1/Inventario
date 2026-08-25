"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehousesPage = void 0;
const react_1 = require("react");
const warehouse_service_ts_1 = require("../api/warehouse.service.ts");
const WarehousesPage = () => {
    const [warehouses, setWarehouses] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)('');
    // Estados para el modal (Crear / Editar) - Solo campos existentes en Prisma
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    const [currentWarehouse, setCurrentWarehouse] = (0, react_1.useState)({ name: '', location: '' });
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const fetchWarehouses = async () => {
        try {
            setLoading(true);
            const data = await warehouse_service_ts_1.warehouseService.getAll();
            setWarehouses(data);
        }
        catch (err) {
            setError('Error al cargar los almacenes.');
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        fetchWarehouses();
    }, []);
    const handleOpenCreate = () => {
        setCurrentWarehouse({ name: '', location: '' });
        setIsEditing(false);
        setIsModalOpen(true);
    };
    const handleOpenEdit = (warehouse) => {
        setCurrentWarehouse(warehouse);
        setIsEditing(true);
        setIsModalOpen(true);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Extraemos únicamente name y location para evitar mandar campos de más (como id, createdAt, stocks)
            const payload = {
                name: currentWarehouse.name,
                location: currentWarehouse.location,
            };
            if (isEditing && currentWarehouse.id) {
                await warehouse_service_ts_1.warehouseService.update(currentWarehouse.id, payload);
            }
            else {
                await warehouse_service_ts_1.warehouseService.create(payload);
            }
            setIsModalOpen(false);
            fetchWarehouses();
        }
        catch (err) {
            alert('Error al guardar el almacén');
        }
    };
    const handleDelete = async (id) => {
        if (confirm('¿Estás seguro de eliminar este almacén?')) {
            try {
                await warehouse_service_ts_1.warehouseService.delete(id);
                fetchWarehouses();
            }
            catch (err) {
                alert('No se pudo eliminar el almacén');
            }
        }
    };
    return (<div className="p-8 max-w-6xl mx-auto text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-indigo-400">Gestión de Almacenes</h1>
          <p className="text-sm text-gray-400">Administra los depósitos y sucursales de inventario</p>
        </div>
        <button onClick={handleOpenCreate} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded font-semibold text-sm transition">
          + Nuevo Almacén
        </button>
      </div>

      {error && <div className="p-4 mb-4 bg-red-600/20 border border-red-500 rounded text-red-200">{error}</div>}

      {loading ? (<p className="text-gray-400">Cargando almacenes...</p>) : (<div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/50 text-gray-400 text-xs uppercase border-b border-gray-700">
                <th className="p-4">Nombre</th>
                <th className="p-4">Ubicación</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 text-sm">
              {warehouses.length === 0 ? (<tr>
                  <td colSpan={3} className="p-4 text-center text-gray-400">No hay almacenes registrados.</td>
                </tr>) : (warehouses.map((wh) => (<tr key={wh.id} className="hover:bg-gray-750 transition">
                    <td className="p-4 font-medium text-white">{wh.name}</td>
                    <td className="p-4 text-gray-300">{wh.location || 'N/A'}</td>
                    <td className="p-4 text-center space-x-2">
                      <button onClick={() => handleOpenEdit(wh)} className="px-3 py-1 bg-blue-600/80 hover:bg-blue-600 rounded text-xs transition">
                        Editar
                      </button>
                      <button onClick={() => handleDelete(wh.id)} className="px-3 py-1 bg-red-600/80 hover:bg-red-600 rounded text-xs transition">
                        Eliminar
                      </button>
                    </td>
                  </tr>)))}
            </tbody>
          </table>
        </div>)}

      {/* MODAL CREAR / EDITAR */}
      {isModalOpen && (<div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-indigo-400 mb-4">
              {isEditing ? 'Editar Almacén' : 'Crear Nuevo Almacén'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Nombre</label>
                <input type="text" required value={currentWarehouse.name || ''} onChange={(e) => setCurrentWarehouse({ ...currentWarehouse, name: e.target.value })} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-indigo-500 text-sm" placeholder="Ej. Almacén Central"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Ubicación</label>
                <input type="text" value={currentWarehouse.location || ''} onChange={(e) => setCurrentWarehouse({ ...currentWarehouse, location: e.target.value })} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-indigo-500 text-sm" placeholder="Ej. Av. Principal #123"/>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm font-semibold transition">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>)}
    </div>);
};
exports.WarehousesPage = WarehousesPage;
