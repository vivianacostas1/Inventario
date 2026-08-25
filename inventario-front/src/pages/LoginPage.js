"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const react_1 = require("react");
const AuthContext_1 = require("../context/AuthContext");
const react_router_dom_1 = require("react-router-dom");
const LoginPage = () => {
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const { login } = (0, AuthContext_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/'); // Redirige al dashboard tras iniciar sesión exitosamente
        }
        catch (err) {
            setError(err.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-400">Iniciar Sesión - Inventario</h2>

        {error && (<div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded text-sm">
            {error}
          </div>)}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Correo Electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-indigo-500 text-white" placeholder="correo@ejemplo.com"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-indigo-500 text-white" placeholder="••••••••"/>
          </div>

          <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 rounded text-white font-semibold transition duration-200 disabled:opacity-50">
            {loading ? 'Iniciando sesión...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>);
};
exports.LoginPage = LoginPage;
