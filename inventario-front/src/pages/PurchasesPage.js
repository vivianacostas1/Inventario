"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchasesPage = PurchasesPage;
const react_1 = require("react");
const axios_1 = __importDefault(require("../api/axios"));
const AuthContext_1 = require("../context/AuthContext");
function PurchasesPage() {
    const { user } = (0, AuthContext_1.useAuth)();
    const [purchases, setPurchases] = (0, react_1.useState)([]);
    const [suppliers, setSuppliers] = (0, react_1.useState)([]);
    const [products, setProducts] = (0, react_1.useState)([]);
    const [warehouses, setWarehouses] = (0, react_1.useState)([]);
    const [shareholders, setShareholders] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [showModal, setShowModal] = (0, react_1.useState)(false);
    const [editingPurchaseId, setEditingPurchaseId] = (0, react_1.useState)(null);
    // Estados para el modal de recibir compra
    const [showReceiveModal, setShowReceiveModal] = (0, react_1.useState)(false);
    const [selectedPurchaseId, setSelectedPurchaseId] = (0, react_1.useState)(null);
    const [targetWarehouseId, setTargetWarehouseId] = (0, react_1.useState)('');
    // Estados para el formulario de Nueva/Editar Compra
    const [supplierId, setSupplierId] = (0, react_1.useState)('');
    const [shareholderId, setShareholderId] = (0, react_1.useState)('');
    const [items, setItems] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            setLoading(true);
            const [purchasesRes, suppliersRes, productsRes, warehousesRes, shareholdersRes] = await Promise.all([
                axios_1.default.get('/purchases'),
                axios_1.default.get('/suppliers'),
                axios_1.default.get('/products'),
                axios_1.default.get('/warehouses'),
                axios_1.default.get('/shareholders')
            ]);
            setPurchases(purchasesRes.data);
            setSuppliers(suppliersRes.data);
            setProducts(productsRes.data);
            setWarehouses(warehousesRes.data);
            setShareholders(shareholdersRes.data);
        }
        catch (error) {
            console.error("Error al cargar datos", error);
        }
        finally {
            setLoading(false);
        }
    };
    // ---- LÓGICA PARA MANEJAR LOS ÍTEMS DINÁMICOS ----
    const addItem = () => {
        setItems([...items, { productId: '', quantity: 1, unitCost: 0, subtotal: 0 }]);
    };
    const removeItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };
    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        if (field === 'productId') {
            const selectedProduct = products.find(p => p.id === value);
            if (selectedProduct) {
                newItems[index].unitCost = Number(selectedProduct.costPrice || 0);
            }
        }
        // @ts-ignore
        newItems[index][field] = value;
        if (field === 'quantity' || field === 'unitCost' || field === 'productId') {
            newItems[index].subtotal = Number(newItems[index].quantity) * Number(newItems[index].unitCost);
        }
        setItems(newItems);
    };
    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
    // ---- ABRIR MODAL PARA CREAR O EDITAR ----
    const handleOpenCreateModal = () => {
        setEditingPurchaseId(null);
        setSupplierId('');
        setShareholderId('');
        setItems([{ productId: '', quantity: 1, unitCost: 0, subtotal: 0 }]);
        setShowModal(true);
    };
    const handleOpenEditModal = (purchase) => {
        setEditingPurchaseId(purchase.id);
        setSupplierId(purchase.supplierId || '');
        setShareholderId(purchase.shareholderId || '');
        // Mapear los ítems existentes de la compra para el formulario
        const mappedItems = purchase.items?.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitCost: Number(item.unitCost),
            subtotal: Number(item.subtotal)
        })) || [];
        setItems(mappedItems);
        setShowModal(true);
    };
    // ---- ELIMINAR COMPRA ----
    const handleDeletePurchase = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar esta orden de compra?"))
            return;
        try {
            await axios_1.default.delete(`/purchases/${id}`);
            alert("Compra eliminada con éxito.");
            fetchData();
        }
        catch (error) {
            console.error("Error al eliminar compra:", error.response?.data);
            alert(error.response?.data?.error || "Error al eliminar la compra");
        }
    };
    // ---- FUNCIÓN PARA ABRIR EL MODAL DE RECIBIR COMPRA ----
    const openReceiveModal = (purchaseId) => {
        setSelectedPurchaseId(purchaseId);
        setTargetWarehouseId('');
        setShowReceiveModal(true);
    };
    // ---- FUNCIÓN PARA CONFIRMAR LA RECEPCIÓN ----
    const handleConfirmReceive = async (e) => {
        e.preventDefault();
        if (!selectedPurchaseId || !targetWarehouseId) {
            return alert("Selecciona un almacén de destino.");
        }
        try {
            await axios_1.default.patch(`/purchases/${selectedPurchaseId}/status`, {
                status: 'RECEIVED',
                warehouseId: targetWarehouseId
            });
            alert("¡Compra recibida con éxito! Stock e inventario de accionista actualizados.");
            setShowReceiveModal(false);
            setSelectedPurchaseId(null);
            setTargetWarehouseId('');
            fetchData();
        }
        catch (error) {
            console.error("Error al recibir compra:", error.response?.data);
            alert(error.response?.data?.error || "Error al actualizar el estado de la compra");
        }
    };
    // ---- ENVÍO AL BACKEND (CREAR O ACTUALIZAR) ----
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!supplierId)
            return alert("Selecciona un proveedor");
        if (items.length === 0)
            return alert("Debes agregar al menos un producto a la compra");
        if (items.some(item => !item.productId || item.quantity <= 0 || item.unitCost <= 0)) {
            return alert("Verifica que todos los ítems tengan un producto, cantidad y costo válido.");
        }
        const payload = {
            supplierId,
            shareholderId: shareholderId || null,
            userId: user?.id,
            items: items.map(item => ({
                productId: item.productId,
                quantity: Number(item.quantity),
                unitCost: Number(item.unitCost),
                subtotal: Number(item.subtotal)
            })),
            totalAmount
        };
        try {
            if (editingPurchaseId) {
                await axios_1.default.put(`/purchases/${editingPurchaseId}`, payload);
                alert("¡Compra actualizada con éxito!");
            }
            else {
                await axios_1.default.post('/purchases', payload);
                alert("¡Compra registrada con éxito!");
            }
            setShowModal(false);
            setEditingPurchaseId(null);
            setSupplierId('');
            setShareholderId('');
            setItems([]);
            fetchData();
        }
        catch (error) {
            console.error("Error al guardar compra:", error.response?.data);
            alert(error.response?.data?.error || "Error al procesar la compra");
        }
    };
    return (<div className="p-6 text-white h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Compras a Proveedores</h1>
          <p className="text-sm text-gray-400">Historial de reabastecimiento y órdenes de compra.</p>
        </div>
        <button onClick={handleOpenCreateModal} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded font-semibold text-sm transition">
          + Nueva Compra
        </button>
      </div>

      {/* Tabla de Compras */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 text-gray-400 text-sm border-b border-gray-700">
              <th className="p-3">Fecha</th>
              <th className="p-3">Proveedor</th>
              <th className="p-3">Accionista</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-right">Total ($)</th>
              <th className="p-3">Registrado por</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 text-sm">
            {loading ? (<tr><td colSpan={7} className="text-center p-4 text-gray-400">Cargando compras...</td></tr>) : purchases.length === 0 ? (<tr><td colSpan={7} className="text-center p-4 text-gray-400">No hay compras registradas.</td></tr>) : (purchases.map((p) => (<tr key={p.id} className="hover:bg-gray-750 transition">
                  <td className="p-3 text-gray-300">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 font-medium">{p.supplier?.name || 'Desconocido'}</td>
                  <td className="p-3 text-emerald-300 font-medium">{p.shareholder?.name || <span className="text-gray-500">Sin asignar</span>}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${p.status === 'RECEIVED' ? 'bg-emerald-900 text-emerald-300' :
                p.status === 'PENDING' ? 'bg-amber-900 text-amber-300' :
                    'bg-rose-900 text-rose-300'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold text-emerald-400">${Number(p.totalAmount).toFixed(2)}</td>
                  <td className="p-3 text-gray-400">{p.user?.name || 'Sistema'}</td>
                  <td className="p-3 text-center space-x-2">
                    {p.status === 'PENDING' && (<button onClick={() => openReceiveModal(p.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded text-xs font-semibold transition shadow" title="Recibir Compra">
                        Recibir
                      </button>)}
                    <button onClick={() => handleOpenEditModal(p)} className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded text-xs font-semibold transition shadow" title="Editar Compra">
                      Editar
                    </button>
                    <button onClick={() => handleDeletePurchase(p.id)} className="bg-rose-600 hover:bg-rose-500 text-white px-2.5 py-1 rounded text-xs font-semibold transition shadow" title="Eliminar Compra">
                      Eliminar
                    </button>
                  </td>
                </tr>)))}
          </tbody>
        </table>
      </div>

      {/* Modal para Seleccionar Almacén al Recibir Compra */}
      {showReceiveModal && (<div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold mb-2">Recibir Orden de Compra</h2>
            <p className="text-sm text-gray-400 mb-4">Selecciona el almacén donde ingresará la mercancía:</p>
            <form onSubmit={handleConfirmReceive} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Almacén de Destino</label>
                <select value={targetWarehouseId} onChange={(e) => setTargetWarehouseId(e.target.value)} className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white text-sm" required>
                  <option value="">Selecciona un almacén...</option>
                  {warehouses.map(w => (<option key={w.id} value={w.id}>{w.name}</option>))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowReceiveModal(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-sm font-semibold transition">
                  Confirmar Recepción
                </button>
              </div>
            </form>
          </div>
        </div>)}

      {/* Modal Nueva / Editar Compra */}
      {showModal && (<div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-4xl border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingPurchaseId ? 'Editar Orden de Compra' : 'Registrar Nueva Compra'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Proveedor</label>
                  <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white text-sm" required>
                    <option value="">Selecciona un proveedor...</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Accionista Financiador (Opcional)</label>
                  <select value={shareholderId} onChange={(e) => setShareholderId(e.target.value)} className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white text-sm">
                    <option value="">Sin accionista (Compra general)</option>
                    {shareholders.map(sh => <option key={sh.id} value={sh.id}>{sh.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-emerald-400">Productos a Comprar</h3>
                  <button type="button" onClick={addItem} className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">
                    + Añadir Producto
                  </button>
                </div>
                
                {items.length === 0 && (<p className="text-sm text-gray-500 py-2">No hay productos agregados.</p>)}

                <div className="space-y-2">
                  {items.map((item, index) => (<div key={index} className="flex gap-2 items-end bg-gray-900 p-3 rounded border border-gray-750">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-400 mb-1">Producto</label>
                        <select value={item.productId} onChange={(e) => handleItemChange(index, 'productId', e.target.value)} className="w-full bg-gray-800 border border-gray-700 p-2 rounded text-white text-sm" required>
                          <option value="">Seleccionar...</option>
                          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div className="w-24">
                        <label className="block text-xs text-gray-400 mb-1">Cant.</label>
                        <input type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="w-full bg-gray-800 border border-gray-700 p-2 rounded text-white text-sm" required/>
                      </div>
                      <div className="w-32">
                        <label className="block text-xs text-gray-400 mb-1">Costo Unit ($)</label>
                        <input type="number" step="0.01" min="0" value={item.unitCost} onChange={(e) => handleItemChange(index, 'unitCost', e.target.value)} className="w-full bg-gray-800 border border-gray-700 p-2 rounded text-white text-sm" required/>
                      </div>
                      <div className="w-32">
                        <label className="block text-xs text-gray-400 mb-1">Subtotal</label>
                        <div className="p-2 bg-gray-800 border border-gray-700 rounded text-sm text-emerald-400 font-bold">
                          ${item.subtotal.toFixed(2)}
                        </div>
                      </div>
                      <button type="button" onClick={() => removeItem(index)} className="p-2 bg-rose-600 hover:bg-rose-500 rounded text-white transition" title="Eliminar fila">
                        X
                      </button>
                    </div>))}
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-700 pt-4 mt-4">
                <div className="text-xl font-bold text-white">
                  Total de la Orden: <span className="text-emerald-400">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-sm font-semibold transition">
                    {editingPurchaseId ? 'Guardar Cambios' : 'Registrar Compra'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>)}
    </div>);
}
