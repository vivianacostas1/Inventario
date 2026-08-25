"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuppliersPage = void 0;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const axios_1 = __importDefault(require("../api/axios"));
const SuppliersPage = () => {
    const [suppliers, setSuppliers] = (0, react_1.useState)([]);
    const [name, setName] = (0, react_1.useState)('');
    const [email, setEmail] = (0, react_1.useState)('');
    const [phone, setPhone] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            const response = await axios_1.default.get('/suppliers');
            setSuppliers(Array.isArray(response.data) ? response.data : []);
        }
        catch (err) {
            console.error('Error al cargar proveedores', err);
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        fetchSuppliers();
    }, []);
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios_1.default.post('/suppliers', { name, email, phone });
            setName('');
            setEmail('');
            setPhone('');
            fetchSuppliers();
        }
        catch (err) {
            alert('Error al crear el proveedor en el servidor.');
        }
    };
    return (<div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
        <div>
          <h1 className="text-3xl font-bold text-indigo-400">🏭 Gestión de Proveedores</h1>
          <p className="text-gray-300 text-sm mt-1">Registra las empresas que te abastecen de productos e insumos.</p>
        </div>
        <react_router_dom_1.Link to="/products" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition">
          &larr; Volver a Productos
        </react_router_dom_1.Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Formulario */}
        <form onSubmit={handleCreate} className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4 h-fit shadow-xl">
          <h2 className="text-lg font-bold text-white border-b border-gray-700 pb-3">Nuevo Proveedor</h2>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Empresa / Nombre *</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" placeholder="Ej. Proveedor S.A."/>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Correo Electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" placeholder="contacto@proveedor.com"/>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Teléfono</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" placeholder="+54 9 ..."/>
          </div>
          <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm transition shadow-md">
            Guardar Proveedor
          </button>
        </form>

        {/* Listado */}
        <div className="md:col-span-2 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
          <div className="p-4 bg-gray-900/40 border-b border-gray-700 font-semibold text-gray-300 text-sm">
            Proveedores Existentes
          </div>
          {loading ? (<div className="p-8 text-center text-gray-400">Cargando proveedores...</div>) : suppliers.length === 0 ? (<div className="p-8 text-center text-gray-400">No hay proveedores registrados.</div>) : (<table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900/60 border-b border-gray-700 text-gray-400 text-xs uppercase">
                  <th className="p-4">Nombre</th>
                  <th className="p-4">Correo</th>
                  <th className="p-4">Teléfono</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-gray-200 text-sm">
                {suppliers.map((sup) => (<tr key={sup.id} className="hover:bg-gray-700/40 transition">
                    <td className="p-4 font-semibold text-white">{sup.name}</td>
                    <td className="p-4 text-gray-400">{sup.email || 'Sin correo'}</td>
                    <td className="p-4 text-gray-400">{sup.phone || 'Sin teléfono'}</td>
                  </tr>))}
              </tbody>
            </table>)}
        </div>
      </div>
    </div>);
};
exports.SuppliersPage = SuppliersPage;
