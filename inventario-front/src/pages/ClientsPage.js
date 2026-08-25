"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsPage = ClientsPage;
const react_1 = require("react");
const axios_1 = __importDefault(require("../api/axios"));
function ClientsPage() {
    const [customers, setCustomers] = (0, react_1.useState)([]);
    const [name, setName] = (0, react_1.useState)('');
    const [email, setEmail] = (0, react_1.useState)('');
    const [phone, setPhone] = (0, react_1.useState)('');
    const [address, setAddress] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(true);
    const fetchCustomers = async () => {
        try {
            const response = await axios_1.default.get('/customers');
            setCustomers(response.data);
        }
        catch (error) {
            console.error("Error al cargar clientes", error);
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        fetchCustomers();
    }, []);
    const handleCreateCustomer = async (e) => {
        e.preventDefault();
        if (!name.trim())
            return alert("El nombre es obligatorio");
        // Validar que no se permita registrar "Generico" o "Genérico" manualmente
        const normalizedName = name.trim().toLowerCase();
        if (normalizedName === 'generico' || normalizedName === 'genérico') {
            alert("No puedes registrar manualmente un cliente con el nombre 'Genérico'. Este nombre es reservado para el autocompletado de ventas.");
            return;
        }
        try {
            await axios_1.default.post('/customers', {
                name,
                email: email.trim() || undefined,
                phone: phone.trim() || undefined,
                address: address.trim() || undefined
            });
            setName('');
            setEmail('');
            setPhone('');
            setAddress('');
            fetchCustomers();
        }
        catch (error) {
            console.error("Error al crear cliente", error);
            alert("No se pudo registrar el cliente");
        }
    };
    const handleDeleteCustomer = async (id) => {
        if (!confirm("¿Seguro que deseas eliminar este cliente?"))
            return;
        try {
            await axios_1.default.delete(`/customers/${id}`);
            fetchCustomers();
        }
        catch (error) {
            console.error("Error al eliminar cliente", error);
            alert("No se pudo eliminar el cliente");
        }
    };
    return (<div className="p-8 max-w-7xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">Gestión de Clientes</h1>

      {/* Formulario para registrar cliente alineado al modelo */}
      <form onSubmit={handleCreateCustomer} className="bg-gray-800 p-6 rounded-lg mb-8 border border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Nombre (*)</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Juan Pérez" className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white" required/>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Correo electrónico</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ej. juan@email.com" className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white"/>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Teléfono</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ej. 70000000" className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white"/>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Dirección</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ej. Av. Principal #123" className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white"/>
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded font-semibold transition">
            + Registrar Cliente
          </button>
        </div>
      </form>

      {/* Tabla de Clientes */}
      <div className="bg-gray-800 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-sm">
              <th className="p-4">NOMBRE</th>
              <th className="p-4">CORREO</th>
              <th className="p-4">TELÉFONO</th>
              <th className="p-4">DIRECCIÓN</th>
              <th className="p-4 text-right">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (<tr><td colSpan={5} className="p-4 text-center text-gray-400">Cargando clientes...</td></tr>) : customers.length > 0 ? (customers.map((customer) => (<tr key={customer.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="p-4 font-medium text-indigo-300">{customer.name}</td>
                  <td className="p-4 text-gray-300">{customer.email || 'Sin correo'}</td>
                  <td className="p-4 text-gray-300">{customer.phone || 'Sin teléfono'}</td>
                  <td className="p-4 text-gray-300">{customer.address || 'Sin dirección'}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDeleteCustomer(customer.id)} className="px-3 py-1 bg-red-600/80 hover:bg-red-600 rounded text-sm transition">
                      Eliminar
                    </button>
                  </td>
                </tr>))) : (<tr><td colSpan={5} className="p-4 text-center text-gray-500 italic">No hay clientes registrados.</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>);
}
