import { useState, useEffect } from 'react';
import api from '../api/axios';

export function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Estados para el modal de Crear/Editar Producto
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    categoryId: '',
    supplierId: '',
    costPrice: 0,
    unitPrice: 0,
    minStock: 0,
    maxStock: 0
  });

  const fetchData = async () => {
    try {
      const [prodRes, catRes, supRes] = await Promise.allSettled([
        api.get('/products'),
        api.get('/categories'),
        api.get('/suppliers')
      ]);

      if (prodRes.status === 'fulfilled') {
        setProducts(Array.isArray(prodRes.value.data) ? prodRes.value.data : prodRes.value.data?.data || []);
      }
      if (catRes.status === 'fulfilled') {
        setCategories(Array.isArray(catRes.value.data) ? catRes.value.data : catRes.value.data?.data || []);
      }
      if (supRes.status === 'fulfilled') {
        setSuppliers(Array.isArray(supRes.value.data) ? supRes.value.data : supRes.value.data?.data || []);
      }
    } catch (error) {
      console.error("Error al cargar datos", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreateModal = async () => {
    setEditingProductId(null);
    try {
      const res = await api.get('/products/next-sku');
      setNewProduct({ 
        sku: res.data.sku || '', 
        name: '', 
        categoryId: '', 
        supplierId: '', 
        costPrice: 0, 
        unitPrice: 0, 
        minStock: 0, 
        maxStock: 0 
      });
    } catch (error) {
      console.error("Error al obtener el SKU sugerido", error);
      setNewProduct({ sku: '', name: '', categoryId: '', supplierId: '', costPrice: 0, unitPrice: 0, minStock: 0, maxStock: 0 });
    }
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (prod: any) => {
    setEditingProductId(prod.id);
    setNewProduct({
      sku: prod.sku || '',
      name: prod.name || '',
      categoryId: prod.categoryId || '',
      supplierId: prod.supplierId || '',
      costPrice: prod.costPrice ?? prod.precio_costo ?? 0,
      unitPrice: prod.unitPrice ?? prod.precio_unitario ?? 0,
      minStock: prod.minStock ?? prod.stock_minimo ?? 0,
      maxStock: prod.maxStock ?? prod.stock_maximo ?? 0
    });
    setIsCreateModalOpen(true);
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar (desactivar) el producto "${name}"?`)) {
      try {
        await api.delete(`/products/${id}`);
        alert('¡Producto eliminado correctamente!');
        fetchData();
      } catch (error: any) {
        console.error("Error al eliminar el producto", error);
        alert(error.response?.data?.error || 'No se pudo eliminar el producto');
      }
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        sku: newProduct.sku,
        name: newProduct.name,
        categoryId: newProduct.categoryId,
        supplierId: newProduct.supplierId,
        costPrice: Number(newProduct.costPrice),
        unitPrice: Number(newProduct.unitPrice),
        minStock: Number(newProduct.minStock),
        maxStock: Number(newProduct.maxStock)
      };

      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, payload);
        alert('¡Producto actualizado con éxito!');
      } else {
        await api.post('/products', payload);
        alert('¡Producto creado con éxito!');
      }

      setIsCreateModalOpen(false);
      setEditingProductId(null);
      setNewProduct({ sku: '', name: '', categoryId: '', supplierId: '', costPrice: 0, unitPrice: 0, minStock: 0, maxStock: 0 });
      fetchData();
    } catch (error: any) {
      console.error("Error al guardar producto", error);
      alert(error.response?.data?.error || 'No se pudo guardar el producto');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Productos</h1>
          <p className="text-gray-400">Control de inventario, SKU, precios y categorías.</p>
        </div>
        <button 
          onClick={handleOpenCreateModal} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
        >
          + Nuevo Producto
        </button>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-gray-800 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-sm">
              <th className="p-4">SKU</th>
              <th className="p-4">NOMBRE</th>
              <th className="p-4">CATEGORÍA</th>
              <th className="p-4">PRECIO COMPRA</th>
              <th className="p-4">PRECIO VENTA</th>
              <th className="p-4">TOTAL ASIGNADO</th>
              <th className="p-4 text-right">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod: any) => {
               const list = prod.shareholders || prod.shareholderProducts || prod.accionistas_productos || [];
               const totalAssigned = list.reduce((acc: number, sp: any) => acc + (sp.quantity || sp.cantidad || 0), 0);

              return (
                <tr key={prod.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="p-4 text-indigo-300 font-medium">{prod.sku}</td>
                  <td className="p-4">{prod.name}</td>
                  <td className="p-4">
                    <span className="bg-gray-700 px-2 py-1 rounded text-xs">
                      {prod.category?.name || 'Sin categoría'}
                    </span>
                  </td>
                  
                  <td className="p-4 text-gray-300">${prod.costPrice ?? prod.precio_costo ?? 0}</td>
                  <td className="p-4 text-green-400 font-semibold">${prod.unitPrice ?? prod.precio_unitario ?? 0}</td>
                  
                  <td className="p-4 font-bold text-indigo-400">
                    {totalAssigned} un.
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenEditModal(prod)}
                        title="Editar Producto"
                        className="p-2 bg-gray-700 hover:bg-indigo-600 text-gray-300 hover:text-white rounded-lg transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      <button 
                        onClick={() => handleDeleteProduct(prod.id, prod.name)}
                        title="Eliminar Producto"
                        className="p-2 bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white rounded-lg transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal: Crear / Editar Producto */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full shadow-xl border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-indigo-400">
              {editingProductId ? 'Editar Producto' : 'Crear Nuevo Producto'}
            </h2>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">SKU</label>
                <input 
                  type="text" 
                  value={newProduct.sku} 
                  readOnly={!editingProductId} 
                  className={`w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none ${!editingProductId ? 'cursor-not-allowed opacity-80' : 'focus:border-indigo-500'}`}
                  required
                />
                {!editingProductId && (
                  <p className="text-xs text-gray-400 mt-1">El SKU se genera automáticamente y no se puede modificar.</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Nombre</label>
                <input 
                  type="text" 
                  value={newProduct.name} 
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} 
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Categoría</label>
                <select 
                  value={newProduct.categoryId} 
                  onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                  required
                >
                  <option value="">-- Seleccione Categoría --</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Proveedor</label>
                <select 
                  value={newProduct.supplierId} 
                  onChange={(e) => setNewProduct({ ...newProduct, supplierId: e.target.value })}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                  required
                >
                  <option value="">-- Seleccione Proveedor --</option>
                  {suppliers.map((sup: any) => (
                    <option key={sup.id} value={sup.id}>{sup.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Stock Mínimo</label>
                <input 
                  type="number" 
                  min="0"
                  value={newProduct.minStock} 
                  onChange={(e) => setNewProduct({ ...newProduct, minStock: Number(e.target.value) })} 
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Stock Máximo</label>
                <input 
                  type="number" 
                  min="0"
                  value={newProduct.maxStock} 
                  onChange={(e) => setNewProduct({ ...newProduct, maxStock: Number(e.target.value) })} 
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Precio Compra</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  value={newProduct.costPrice} 
                  onChange={(e) => setNewProduct({ ...newProduct, costPrice: Number(e.target.value) })} 
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Precio Venta</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  value={newProduct.unitPrice} 
                  onChange={(e) => setNewProduct({ ...newProduct, unitPrice: Number(e.target.value) })} 
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-semibold transition"
                >
                  {editingProductId ? 'Actualizar Producto' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}