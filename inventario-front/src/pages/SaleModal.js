"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleModal = SaleModal;
const react_1 = require("react");
const axios_1 = __importDefault(require("../api/axios"));
function SaleModal({ onClose, onSaleSuccess }) {
    const [products, setProducts] = (0, react_1.useState)([]);
    const [shareholders, setShareholders] = (0, react_1.useState)([]);
    const [shareholderProducts, setShareholderProducts] = (0, react_1.useState)([]);
    const [customers, setCustomers] = (0, react_1.useState)([]);
    const [warehouses, setWarehouses] = (0, react_1.useState)([]);
    const [selectedItems, setSelectedItems] = (0, react_1.useState)([
        { productId: '', shareholderId: '', quantity: 1, unitPrice: '' }
    ]);
    const [clientId, setClientId] = (0, react_1.useState)('');
    const [clientSearch, setClientSearch] = (0, react_1.useState)('');
    const [showClientDropdown, setShowClientDropdown] = (0, react_1.useState)(false);
    const clientDropdownRef = (0, react_1.useRef)(null);
    const [warehouseId, setWarehouseId] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        axios_1.default.get('/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error("Error al cargar productos", err));
        axios_1.default.get('/shareholders')
            .then(res => setShareholders(res.data))
            .catch(err => console.error("Error al cargar accionistas", err));
        axios_1.default.get('/shareholder-products')
            .then(res => setShareholderProducts(res.data))
            .catch(err => console.error("Error al cargar stock de accionistas", err));
        axios_1.default.get('/customers')
            .then(res => setCustomers(res.data))
            .catch(err => console.error("Error al cargar clientes", err));
        axios_1.default.get('/warehouses')
            .then(res => {
            setWarehouses(res.data);
            if (res.data.length > 0)
                setWarehouseId(res.data[0].id);
        })
            .catch(err => console.error("Error al cargar almacenes", err));
        const handleClickOutside = (event) => {
            if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target)) {
                setShowClientDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()));
    const addProductRow = () => {
        setSelectedItems([...selectedItems, { productId: '', shareholderId: '', quantity: 1, unitPrice: '' }]);
    };
    const handleSale = async () => {
        let finalClientId = clientId;
        if (!clientSearch.trim()) {
            alert("Por favor ingresa o selecciona un cliente");
            return;
        }
        try {
            setLoading(true);
            if (!finalClientId) {
                const matchedCustomer = customers.find(c => c.name.toLowerCase() === clientSearch.trim().toLowerCase());
                if (matchedCustomer) {
                    finalClientId = matchedCustomer.id;
                }
                else {
                    const newCustRes = await axios_1.default.post('/customers', { name: clientSearch.trim() });
                    finalClientId = newCustRes.data.id;
                }
            }
            if (!finalClientId) {
                alert("No se pudo determinar o registrar el cliente.");
                setLoading(false);
                return;
            }
            if (!warehouseId) {
                alert("Por favor selecciona un almacén de origen");
                setLoading(false);
                return;
            }
            if (selectedItems.length === 0 || selectedItems.some(i => !i.productId || !i.shareholderId)) {
                alert("Selecciona un producto y un accionista para cada línea");
                setLoading(false);
                return;
            }
            // 🛑 Validación en el Frontend antes de enviar
            for (const item of selectedItems) {
                const productObj = products.find(p => p.id === item.productId);
                if (productObj) {
                    const costPrice = Number(productObj.costPrice || productObj.precio_costo || 0);
                    const enteredPrice = item.unitPrice !== '' ? Number(item.unitPrice) : Number(productObj.unitPrice);
                    if (enteredPrice < costPrice) {
                        alert(`El producto "${productObj.name}" no se puede vender por debajo de su precio de costo (Bs ${costPrice.toFixed(2)})`);
                        setLoading(false);
                        return;
                    }
                }
                const sp = shareholderProducts.find(s => s.productId === item.productId && s.shareholderId === item.shareholderId);
                if (!sp || sp.quantity < item.quantity) {
                    const prodName = productObj?.name || 'Producto';
                    const shName = shareholders.find(s => s.id === item.shareholderId)?.name || 'Accionista';
                    alert(`Stock insuficiente para "${prodName}" del accionista "${shName}" (Disponible: ${sp ? sp.quantity : 0})`);
                    setLoading(false);
                    return;
                }
            }
            await axios_1.default.post('/sales', {
                customerId: finalClientId,
                warehouseId,
                items: selectedItems.map(item => ({
                    productId: item.productId,
                    shareholderId: item.shareholderId,
                    quantity: Number(item.quantity),
                    ...(item.unitPrice !== '' ? { unitPrice: Number(item.unitPrice) } : {})
                }))
            });
            onSaleSuccess();
            onClose();
        }
        catch (error) {
            console.error("Error al registrar la venta", error);
            alert(error.response?.data?.error || error.response?.data?.details || "Error al registrar la venta");
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-4xl border border-gray-700 text-white shadow-2xl">
        <h2 className="text-xl font-bold mb-4">Registrar Nueva Venta (Con opción a Precio Personalizado o Costo)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative" ref={clientDropdownRef}>
            <label className="block text-sm text-gray-400 mb-2">Cliente</label>
            <input type="text" placeholder="Escribe 'Genérico' o nombre de cliente..." value={clientSearch} onChange={(e) => {
            setClientSearch(e.target.value);
            setShowClientDropdown(true);
            setClientId('');
        }} onFocus={() => setShowClientDropdown(true)} className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white text-sm"/>

            {showClientDropdown && clientSearch.trim() !== '' && (<div className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {filteredCustomers.length > 0 ? (filteredCustomers.map(c => (<div key={c.id} onClick={() => {
                    setClientId(c.id);
                    setClientSearch(c.name);
                    setShowClientDropdown(false);
                }} className="p-2 hover:bg-gray-700 cursor-pointer text-sm text-gray-200">
                      {c.name} {c.phone ? `(${c.phone})` : ''}
                    </div>))) : (<div className="p-2 text-sm text-emerald-400 bg-gray-850">
                    💡 Se registrará automáticamente como nuevo cliente: <span className="font-bold">"{clientSearch}"</span>
                  </div>)}
              </div>)}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Almacén de Origen</label>
            <select value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white text-sm">
              <option value="">Selecciona un almacén...</option>
              {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
        </div>

        <label className="block text-sm text-gray-400 mb-2">Detalle de Productos, Accionistas y Precios</label>
        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
          {selectedItems.map((item, index) => {
            const selectedProductObj = products.find(p => p.id === item.productId);
            const costPrice = Number(selectedProductObj?.costPrice || selectedProductObj?.precio_costo || 0);
            return (<div key={index} className="flex gap-2 items-center bg-gray-900/50 p-3 rounded border border-gray-700/50">
                
                {/* Selector de Producto */}
                <select className="flex-1 bg-gray-900 border border-gray-700 p-2 rounded text-white text-sm" value={item.productId} onChange={(e) => {
                    const newItems = [...selectedItems];
                    newItems[index].productId = e.target.value;
                    setSelectedItems(newItems);
                }}>
                  <option value="">Selecciona un producto...</option>
                  {products.map(p => (<option key={p.id} value={p.id}>
                      📦 {p.name} (Costo: Bs {Number(p.costPrice || p.precio_costo || 0).toFixed(2)})
                    </option>))}
                </select>

                {/* Selector de Accionista */}
                <select className="flex-1 bg-gray-900 border border-gray-700 p-2 rounded text-white text-sm" value={item.shareholderId} onChange={(e) => {
                    const newItems = [...selectedItems];
                    newItems[index].shareholderId = e.target.value;
                    setSelectedItems(newItems);
                }}>
                  <option value="">Selecciona un accionista...</option>
                  {shareholders.map(s => (<option key={s.id} value={s.id}>
                      👤 {s.name}
                    </option>))}
                </select>

                {/* Cantidad a Vender */}
                <input type="number" min="1" value={item.quantity} placeholder="Cant" className="w-16 bg-gray-900 border border-gray-700 p-2 rounded text-white text-sm text-center" onChange={(e) => {
                    const newItems = [...selectedItems];
                    newItems[index].quantity = parseInt(e.target.value) || 1;
                    setSelectedItems(newItems);
                }}/>

                {/* Input de Precio de Venta Personalizado */}
                <div className="flex flex-col gap-1">
                  <input type="number" step="0.01" value={item.unitPrice} placeholder="Precio Venta" title="Déjalo vacío para usar el precio normal o escribe una rebaja/precio de costo" className="w-28 bg-gray-900 border border-indigo-500/50 p-2 rounded text-white text-sm text-right" onChange={(e) => {
                    const newItems = [...selectedItems];
                    newItems[index].unitPrice = e.target.value === '' ? '' : Number(e.target.value);
                    setSelectedItems(newItems);
                }}/>
                  {selectedProductObj && (<button type="button" onClick={() => {
                        const newItems = [...selectedItems];
                        newItems[index].unitPrice = costPrice;
                        setSelectedItems(newItems);
                    }} className="text-[10px] text-amber-400 hover:underline text-right">
                      Vender al costo (Bs {costPrice.toFixed(2)})
                    </button>)}
                </div>

                {/* Botón para eliminar fila */}
                <button type="button" onClick={() => {
                    const newItems = selectedItems.filter((_, i) => i !== index);
                    setSelectedItems(newItems);
                }} className="text-red-400 hover:text-red-300 px-2 font-bold">
                  ✕
                </button>
              </div>);
        })}
        </div>

        <button onClick={addProductRow} className="text-indigo-400 text-sm mb-6 block hover:underline font-medium">
          + Agregar otro producto
        </button>

        <div className="flex justify-end gap-2 border-t border-gray-700 pt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition">Cancelar</button>
          <button onClick={handleSale} disabled={loading} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded font-semibold transition">
            {loading ? 'Procesando...' : 'Confirmar Venta'}
          </button>
        </div>
      </div>
    </div>);
}
