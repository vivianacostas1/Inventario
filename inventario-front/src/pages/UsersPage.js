"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersPage = void 0;
const react_1 = require("react");
const user_service_1 = require("../api/user.service");
const UsersPage = () => {
    const [users, setUsers] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        loadUsers();
    }, []);
    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await user_service_1.userService.getAll();
            setUsers(data);
        }
        catch (err) {
            setError('Error al cargar los usuarios');
        }
        finally {
            setLoading(false);
        }
    };
    if (loading) {
        return <div className="p-8 text-white bg-gray-900 min-h-screen">Cargando usuarios...</div>;
    }
    return (<div className="p-8 bg-gray-900 min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-400">Gestión de Usuarios</h1>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded">{error}</div>}

        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-700/50 border-b border-gray-700 text-gray-300 text-sm">
                <th className="p-4">Nombre</th>
                <th className="p-4">Correo</th>
                <th className="p-4">Rol</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Creado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 text-sm">
              {users.length === 0 ? (<tr>
                  <td colSpan={5} className="p-4 text-center text-gray-400">No hay usuarios registrados.</td>
                </tr>) : (users.map((user) => (<tr key={user.id} className="hover:bg-gray-700/30 transition">
                    <td className="p-4 font-medium">{user.name}</td>
                    <td className="p-4 text-gray-300">{user.email}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-xs font-semibold">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${user.isActive ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>)))}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
};
exports.UsersPage = UsersPage;
