"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesPage = void 0;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const category_service_1 = require("../api/category.service");
const CategoriesPage = () => {
    const [categories, setCategories] = (0, react_1.useState)([]);
    const [name, setName] = (0, react_1.useState)('');
    const [description, setDescription] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await category_service_1.categoryService.getAll();
            setCategories(Array.isArray(data) ? data : []);
        }
        catch (err) {
            console.error('Error al cargar categorías', err);
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        fetchCategories();
    }, []);
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await category_service_1.categoryService.create({ name, description });
            setName('');
            setDescription('');
            fetchCategories();
        }
        catch (err) {
            // Si el backend responde con un código de éxito sin cuerpo (como 201 o 204), lo tratamos como éxito
            if (err.response && (err.response.status >= 200 && err.response.status < 300)) {
                setName('');
                setDescription('');
                fetchCategories();
                return;
            }
            alert('Error al crear la categoría en el servidor.');
        }
    };
    return (<div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
        <div>
          <h1 className="text-3xl font-bold text-indigo-400">🏷️ Gestión de Categorías</h1>
          <p className="text-gray-300 text-sm mt-1">Organiza tus productos clasificándolos en diferentes categorías.</p>
        </div>
        <react_router_dom_1.Link to="/products" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition">
          &larr; Volver a Productos
        </react_router_dom_1.Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Formulario */}
        <form onSubmit={handleCreate} className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4 h-fit shadow-xl">
          <h2 className="text-lg font-bold text-white border-b border-gray-700 pb-3">Nueva Categoría</h2>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Nombre *</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" placeholder="Ej. Herramientas, Electrónica..."/>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Descripción</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" placeholder="Detalles opcionales..." rows={3}/>
          </div>
          <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm transition shadow-md">
            Guardar Categoría
          </button>
        </form>

        {/* Listado */}
        <div className="md:col-span-2 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
          <div className="p-4 bg-gray-900/40 border-b border-gray-700 font-semibold text-gray-300 text-sm">
            Categorías Existentes
          </div>
          {loading ? (<div className="p-8 text-center text-gray-400">Cargando categorías...</div>) : categories.length === 0 ? (<div className="p-8 text-center text-gray-400">No hay categorías registradas.</div>) : (<table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900/60 border-b border-gray-700 text-gray-400 text-xs uppercase">
                  <th className="p-4">Nombre</th>
                  <th className="p-4">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-gray-200 text-sm">
                {categories.map((cat) => (<tr key={cat.id} className="hover:bg-gray-700/40 transition">
                    <td className="p-4 font-semibold text-white">{cat.name}</td>
                    <td className="p-4 text-gray-400">{cat.description || 'Sin descripción'}</td>
                  </tr>))}
              </tbody>
            </table>)}
        </div>
      </div>
    </div>);
};
exports.CategoriesPage = CategoriesPage;
