import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

// Interfaz para el manejo del estado de los ítems en el formulario
interface PurchaseItemForm {
  productId: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
}

export function PurchasesPage() {
  const { user } = useAuth();

  const [purchases, setPurchases] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [shareholders, setShareholders] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPurchaseId, setEditingPurchaseId] = useState<string | null>(null);

  // ==========================================
  // BUSCADOR Y PAGINACIÓN
  // ==========================================

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Cantidad de compras por página
  const itemsPerPage = 10;

  // ==========================================
  // MODAL RECIBIR COMPRA
  // ==========================================

  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(null);
  const [targetWarehouseId, setTargetWarehouseId] = useState('');

  // ==========================================
  // FORMULARIO NUEVA / EDITAR COMPRA
  // ==========================================

  const [supplierId, setSupplierId] = useState('');
  const [shareholderId, setShareholderId] = useState('');
  const [items, setItems] = useState<PurchaseItemForm[]>([]);

  // ==========================================
  // CARGAR DATOS
  // ==========================================

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        purchasesRes,
        suppliersRes,
        productsRes,
        warehousesRes,
        shareholdersRes
      ] = await Promise.all([
        api.get('/purchases'),
        api.get('/suppliers'),
        api.get('/products'),
        api.get('/warehouses'),
        api.get('/shareholders')
      ]);

      setPurchases(
        Array.isArray(purchasesRes.data)
          ? purchasesRes.data
          : purchasesRes.data?.data || []
      );

      setSuppliers(
        Array.isArray(suppliersRes.data)
          ? suppliersRes.data
          : suppliersRes.data?.data || []
      );

      setProducts(
        Array.isArray(productsRes.data)
          ? productsRes.data
          : productsRes.data?.data || []
      );

      setWarehouses(
        Array.isArray(warehousesRes.data)
          ? warehousesRes.data
          : warehousesRes.data?.data || []
      );

      setShareholders(
        Array.isArray(shareholdersRes.data)
          ? shareholdersRes.data
          : shareholdersRes.data?.data || []
      );

    } catch (error) {
      console.error("Error al cargar datos", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILTRAR COMPRAS
  // ==========================================

  const filteredPurchases = purchases.filter((purchase) => {
    const term = searchTerm.toLowerCase().trim();

    if (!term) {
      return true;
    }

    const supplierName = (
      purchase.supplier?.name || ''
    ).toLowerCase();

    const shareholderName = (
      purchase.shareholder?.name || ''
    ).toLowerCase();

    const userName = (
      purchase.user?.name || ''
    ).toLowerCase();

    const status = (
      purchase.status || ''
    ).toLowerCase();

    const total = String(
      purchase.totalAmount || ''
    ).toLowerCase();

    // Buscar también por productos
    const matchesProduct = purchase.items?.some(
      (item: any) => {
        const productName = (
          item.product?.name ||
          item.productName ||
          products.find(
            (prod) => prod.id === item.productId
          )?.name ||
          ''
        ).toLowerCase();

        return productName.includes(term);
      }
    );

    return (
      supplierName.includes(term) ||
      shareholderName.includes(term) ||
      userName.includes(term) ||
      status.includes(term) ||
      total.includes(term) ||
      matchesProduct
    );
  });

  // ==========================================
  // PAGINACIÓN
  // ==========================================

  const totalPages = Math.ceil(
    filteredPurchases.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const endIndex =
    startIndex + itemsPerPage;

  const paginatedPurchases =
    filteredPurchases.slice(
      startIndex,
      endIndex
    );

  // ==========================================
  // CAMBIAR BÚSQUEDA
  // ==========================================

  const handleSearchChange = (
    value: string
  ) => {
    setSearchTerm(value);

    // Cada nueva búsqueda empieza desde
    // la primera página.
    setCurrentPage(1);
  };

  // ==========================================
  // CAMBIAR PÁGINA
  // ==========================================

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  // ==========================================
  // CREAR / EDITAR ÍTEMS
  // ==========================================

  const addItem = () => {
    setItems([
      ...items,
      {
        productId: '',
        quantity: 1,
        unitCost: 0,
        subtotal: 0
      }
    ]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];

    newItems.splice(index, 1);

    setItems(newItems);
  };

  const handleItemChange = (
    index: number,
    field: keyof PurchaseItemForm,
    value: string | number
  ) => {
    const newItems = [...items];

    if (field === 'productId') {
      const selectedProduct = products.find(
        (p) => p.id === value
      );

      if (selectedProduct) {
        newItems[index].unitCost = Number(
          selectedProduct.costPrice ||
          selectedProduct.precio_costo ||
          0
        );
      }
    }

    // @ts-ignore
    newItems[index][field] = value;

    if (
      field === 'quantity' ||
      field === 'unitCost' ||
      field === 'productId'
    ) {
      newItems[index].subtotal =
        Number(newItems[index].quantity) *
        Number(newItems[index].unitCost);
    }

    setItems(newItems);
  };

  const totalAmount = items.reduce(
    (sum, item) =>
      sum + Number(item.subtotal),
    0
  );

  // ==========================================
  // ABRIR MODAL CREAR
  // ==========================================

  const handleOpenCreateModal = () => {
    setEditingPurchaseId(null);
    setSupplierId('');
    setShareholderId('');

    setItems([
      {
        productId: '',
        quantity: 1,
        unitCost: 0,
        subtotal: 0
      }
    ]);

    setShowModal(true);
  };

  // ==========================================
  // ABRIR MODAL EDITAR
  // ==========================================

  const handleOpenEditModal = (
    purchase: any
  ) => {
    setEditingPurchaseId(purchase.id);

    setSupplierId(
      purchase.supplierId || ''
    );

    setShareholderId(
      purchase.shareholderId || ''
    );

    const mappedItems =
      purchase.items?.map((item: any) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        unitCost: Number(item.unitCost),
        subtotal: Number(item.subtotal)
      })) || [];

    setItems(mappedItems);

    setShowModal(true);
  };

  // ==========================================
  // ELIMINAR COMPRA
  // ==========================================

  const handleDeletePurchase = async (
    id: string
  ) => {
    if (
      !window.confirm(
        "¿Estás seguro de eliminar esta orden de compra?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/purchases/${id}`);

      alert(
        "Compra eliminada con éxito."
      );

      fetchData();

    } catch (error: any) {
      console.error(
        "Error al eliminar compra:",
        error.response?.data
      );

      alert(
        error.response?.data?.error ||
        "Error al eliminar la compra"
      );
    }
  };

  // ==========================================
  // RECIBIR COMPRA
  // ==========================================

  const openReceiveModal = (
    purchaseId: string
  ) => {
    setSelectedPurchaseId(purchaseId);
    setTargetWarehouseId('');
    setShowReceiveModal(true);
  };

  const handleConfirmReceive = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !selectedPurchaseId ||
      !targetWarehouseId
    ) {
      return alert(
        "Selecciona un almacén de destino."
      );
    }

    try {
      await api.patch(
        `/purchases/${selectedPurchaseId}/status`,
        {
          status: 'RECEIVED',
          warehouseId: targetWarehouseId
        }
      );

      alert(
        "¡Compra recibida con éxito! Stock e inventario de accionista actualizados."
      );

      setShowReceiveModal(false);
      setSelectedPurchaseId(null);
      setTargetWarehouseId('');

      fetchData();

    } catch (error: any) {
      console.error(
        "Error al recibir compra:",
        error.response?.data
      );

      alert(
        error.response?.data?.error ||
        "Error al actualizar el estado de la compra"
      );
    }
  };

  // ==========================================
  // GUARDAR COMPRA
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!supplierId) {
      return alert(
        "Selecciona un proveedor"
      );
    }

    if (items.length === 0) {
      return alert(
        "Debes agregar al menos un producto a la compra"
      );
    }

    if (
      items.some(
        (item) =>
          !item.productId ||
          item.quantity <= 0 ||
          item.unitCost <= 0
      )
    ) {
      return alert(
        "Verifica que todos los ítems tengan un producto, cantidad y costo válido."
      );
    }

    const payload = {
      supplierId,
      shareholderId:
        shareholderId || null,
      userId: user?.id,

      items: items.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        unitCost: Number(item.unitCost),
        subtotal: Number(item.subtotal)
      })),

      totalAmount
    };

    try {
      if (editingPurchaseId) {

        await api.put(
          `/purchases/${editingPurchaseId}`,
          payload
        );

        alert(
          "¡Compra actualizada con éxito!"
        );

      } else {

        await api.post(
          '/purchases',
          payload
        );

        alert(
          "¡Compra registrada con éxito!"
        );
      }

      setShowModal(false);
      setEditingPurchaseId(null);
      setSupplierId('');
      setShareholderId('');
      setItems([]);

      setCurrentPage(1);

      fetchData();

    } catch (error: any) {
      console.error(
        "Error al guardar compra:",
        error.response?.data
      );

      alert(
        error.response?.data?.error ||
        "Error al procesar la compra"
      );
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="p-6 text-white h-full overflow-y-auto">

      {/* ======================================
          CABECERA
      ======================================= */}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">

        <div>
          <h1 className="text-2xl font-bold">
            Compras a Proveedores
          </h1>

          <p className="text-sm text-gray-400">
            Historial de reabastecimiento y órdenes de compra.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

          {/* BUSCADOR */}

          <div className="relative w-full sm:w-80">

            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              🔍
            </span>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                handleSearchChange(
                  e.target.value
                )
              }
              placeholder="Buscar producto, proveedor..."
              className="w-full pl-9 pr-9 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() =>
                  handleSearchChange('')
                }
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}

          </div>

          {/* NUEVA COMPRA */}

          <button
            onClick={
              handleOpenCreateModal
            }
            className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded font-semibold text-sm transition whitespace-nowrap"
          >
            + Nueva Compra
          </button>

        </div>

      </div>

      {/* ======================================
          INFORMACIÓN DE RESULTADOS
      ======================================= */}

      {!loading && purchases.length > 0 && (

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 text-sm text-gray-400">

          <div>

            {searchTerm ? (
              <>
                Resultados para{' '}
                <span className="text-indigo-400 font-semibold">
                  "{searchTerm}"
                </span>
                :{' '}
                <span className="text-white font-semibold">
                  {filteredPurchases.length}
                </span>
              </>
            ) : (
              <>
                Total de compras:{' '}
                <span className="text-white font-semibold">
                  {purchases.length}
                </span>
              </>
            )}

          </div>

          {filteredPurchases.length > 0 && (

            <div>
              Mostrando{' '}
              <span className="text-white">
                {startIndex + 1}
              </span>
              {' - '}
              <span className="text-white">
                {Math.min(
                  endIndex,
                  filteredPurchases.length
                )}
              </span>
              {' de '}
              <span className="text-white">
                {filteredPurchases.length}
              </span>
            </div>

          )}

        </div>

      )}

      {/* ======================================
          TABLA DE COMPRAS
      ======================================= */}

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-x-auto shadow-lg">

        <table className="w-full text-left border-collapse">

          <thead>

            <tr className="bg-gray-900 text-gray-400 text-sm border-b border-gray-700">

              <th className="p-3">
                Fecha
              </th>

              <th className="p-3">
                Proveedor
              </th>

              <th className="p-3">
                Accionista
              </th>

              <th className="p-3">
                Productos
              </th>

              <th className="p-3">
                Estado
              </th>

              <th className="p-3 text-right">
                Total ($)
              </th>

              <th className="p-3">
                Registrado por
              </th>

              <th className="p-3 text-center">
                Acciones
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-gray-700 text-sm">

            {loading ? (

              <tr>
                <td
                  colSpan={8}
                  className="text-center p-4 text-gray-400"
                >
                  Cargando compras...
                </td>
              </tr>

            ) : filteredPurchases.length === 0 ? (

              <tr>
                <td
                  colSpan={8}
                  className="text-center p-6 text-gray-400"
                >
                  {searchTerm
                    ? 'No se encontraron compras que coincidan con la búsqueda.'
                    : 'No hay compras registradas.'}
                </td>
              </tr>

            ) : (

              paginatedPurchases.map(
                (p) => {

                  const purchaseItems =
                    p.items || [];

                  return (

                    <tr
                      key={p.id}
                      className="hover:bg-gray-750 transition"
                    >

                      {/* FECHA */}

                      <td className="p-3 text-gray-300 whitespace-nowrap">
                        {p.createdAt
                          ? new Date(
                              p.createdAt
                            ).toLocaleDateString()
                          : 'N/A'}
                      </td>

                      {/* PROVEEDOR */}

                      <td className="p-3 font-medium">
                        {p.supplier?.name ||
                          'Desconocido'}
                      </td>

                      {/* ACCIONISTA */}

                      <td className="p-3 text-emerald-300 font-medium">

                        {p.shareholder?.name ? (

                          p.shareholder.name

                        ) : (

                          <span className="text-gray-500">
                            Sin asignar
                          </span>

                        )}

                      </td>

                      {/* PRODUCTOS */}

                      <td className="p-3 min-w-[280px]">

                        {purchaseItems.length >
                        0 ? (

                          <div className="space-y-2">

                            {purchaseItems.map(
                              (
                                item: any,
                                index: number
                              ) => {

                                const productName =
                                  item.product?.name ||
                                  item.productName ||
                                  products.find(
                                    (prod) =>
                                      prod.id ===
                                      item.productId
                                  )?.name ||
                                  'Producto desconocido';

                                const quantity =
                                  Number(
                                    item.quantity ||
                                      0
                                  );

                                const unitCost =
                                  Number(
                                    item.unitCost ||
                                      0
                                  );

                                const subtotal =
                                  Number(
                                    item.subtotal ||
                                      quantity *
                                        unitCost
                                  );

                                return (

                                  <div
                                    key={
                                      item.id ||
                                      index
                                    }
                                    className="bg-gray-900/70 border border-gray-700 rounded-md px-3 py-2"
                                  >

                                    <div className="flex justify-between items-start gap-3">

                                      <div className="min-w-0">

                                        <div className="font-medium text-indigo-300 truncate">
                                          {productName}
                                        </div>

                                        <div className="text-xs text-gray-400 mt-0.5">
                                          {quantity}{' '}
                                          un. × $
                                          {unitCost.toFixed(
                                            2
                                          )}
                                        </div>

                                      </div>

                                      <div className="text-emerald-400 font-semibold text-xs whitespace-nowrap">
                                        $
                                        {subtotal.toFixed(
                                          2
                                        )}
                                      </div>

                                    </div>

                                  </div>

                                );
                              }
                            )}

                          </div>

                        ) : (

                          <span className="text-gray-500 italic">
                            Sin productos
                          </span>

                        )}

                      </td>

                      {/* ESTADO */}

                      <td className="p-3">

                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            p.status ===
                            'RECEIVED'
                              ? 'bg-emerald-900 text-emerald-300'
                              : p.status ===
                                'PENDING'
                              ? 'bg-amber-900 text-amber-300'
                              : 'bg-rose-900 text-rose-300'
                          }`}
                        >
                          {p.status}
                        </span>

                      </td>

                      {/* TOTAL */}

                      <td className="p-3 text-right font-bold text-emerald-400 whitespace-nowrap">
                        $
                        {Number(
                          p.totalAmount ||
                            0
                        ).toFixed(2)}
                      </td>

                      {/* USUARIO */}

                      <td className="p-3 text-gray-400">
                        {p.user?.name ||
                          'Sistema'}
                      </td>

                      {/* ACCIONES */}

                      <td className="p-3 text-center whitespace-nowrap">

                        {p.status ===
                          'PENDING' && (

                          <button
                            onClick={() =>
                              openReceiveModal(
                                p.id
                              )
                            }
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded text-xs font-semibold transition shadow mr-1"
                            title="Recibir Compra"
                          >
                            Recibir
                          </button>

                        )}

                        <button
                          onClick={() =>
                            handleOpenEditModal(
                              p
                            )
                          }
                          className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded text-xs font-semibold transition shadow mr-1"
                          title="Editar Compra"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() =>
                            handleDeletePurchase(
                              p.id
                            )
                          }
                          className="bg-rose-600 hover:bg-rose-500 text-white px-2.5 py-1 rounded text-xs font-semibold transition shadow"
                          title="Eliminar Compra"
                        >
                          Eliminar
                        </button>

                      </td>

                    </tr>

                  );
                }
              )

            )}

          </tbody>

        </table>

      </div>

      {/* ======================================
          PAGINADOR
      ======================================= */}

      {!loading &&
        filteredPurchases.length > 0 &&
        totalPages > 1 && (

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-5">

            {/* INFORMACIÓN */}

            <div className="text-sm text-gray-400">

              Página{' '}

              <span className="text-white font-semibold">
                {currentPage}
              </span>

              {' '}de{' '}

              <span className="text-white font-semibold">
                {totalPages}
              </span>

            </div>

            {/* BOTONES */}

            <div className="flex items-center gap-1">

              {/* ANTERIOR */}

              <button
                type="button"
                onClick={() =>
                  goToPage(
                    currentPage - 1
                  )
                }
                disabled={
                  currentPage === 1
                }
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === 1
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                ← Anterior
              </button>

              {/* NÚMEROS */}

              {Array.from(
                {
                  length: totalPages
                },
                (_, index) =>
                  index + 1
              ).map((page) => (

                <button
                  key={page}
                  type="button"
                  onClick={() =>
                    goToPage(page)
                  }
                  className={`min-w-[38px] px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    currentPage === page
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                  }`}
                >
                  {page}
                </button>

              ))}

              {/* SIGUIENTE */}

              <button
                type="button"
                onClick={() =>
                  goToPage(
                    currentPage + 1
                  )
                }
                disabled={
                  currentPage ===
                  totalPages
                }
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage ===
                  totalPages
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Siguiente →
              </button>

            </div>

          </div>

        )}

      {/* ======================================
          MODAL RECIBIR COMPRA
      ======================================= */}

      {showReceiveModal && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">

          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md border border-gray-700">

            <h2 className="text-xl font-bold mb-2">
              Recibir Orden de Compra
            </h2>

            <p className="text-sm text-gray-400 mb-4">
              Selecciona el almacén donde ingresará la mercancía:
            </p>

            <form
              onSubmit={
                handleConfirmReceive
              }
              className="space-y-4"
            >

              <div>

                <label className="block text-sm text-gray-400 mb-1">
                  Almacén de Destino
                </label>

                <select
                  value={
                    targetWarehouseId
                  }
                  onChange={(e) =>
                    setTargetWarehouseId(
                      e.target.value
                    )
                  }
                  className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white text-sm"
                  required
                >

                  <option value="">
                    Selecciona un almacén...
                  </option>

                  {warehouses.map(
                    (w) => (

                      <option
                        key={w.id}
                        value={w.id}
                      >
                        {w.name}
                      </option>

                    )
                  )}

                </select>

              </div>

              <div className="flex justify-end gap-2 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowReceiveModal(
                      false
                    )
                  }
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-sm font-semibold transition"
                >
                  Confirmar Recepción
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ======================================
          MODAL NUEVA / EDITAR COMPRA
      ======================================= */}

      {showModal && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">

          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-4xl border border-gray-700 max-h-[90vh] overflow-y-auto">

            <h2 className="text-xl font-bold mb-4">
              {editingPurchaseId
                ? 'Editar Orden de Compra'
                : 'Registrar Nueva Compra'}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* PROVEEDOR / ACCIONISTA */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm text-gray-400 mb-1">
                    Proveedor
                  </label>

                  <select
                    value={supplierId}
                    onChange={(e) =>
                      setSupplierId(
                        e.target.value
                      )
                    }
                    className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white text-sm"
                    required
                  >

                    <option value="">
                      Selecciona un proveedor...
                    </option>

                    {suppliers.map(
                      (s) => (

                        <option
                          key={s.id}
                          value={s.id}
                        >
                          {s.name}
                        </option>

                      )
                    )}

                  </select>

                </div>

                <div>

                  <label className="block text-sm text-gray-400 mb-1">
                    Accionista Financiador (Opcional)
                  </label>

                  <select
                    value={shareholderId}
                    onChange={(e) =>
                      setShareholderId(
                        e.target.value
                      )
                    }
                    className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white text-sm"
                  >

                    <option value="">
                      Sin accionista (Compra general)
                    </option>

                    {shareholders.map(
                      (sh) => (

                        <option
                          key={sh.id}
                          value={sh.id}
                        >
                          {sh.name}
                        </option>

                      )
                    )}

                  </select>

                </div>

              </div>

              {/* PRODUCTOS */}

              <div className="mt-6 border-t border-gray-700 pt-4">

                <div className="flex justify-between items-center mb-2">

                  <h3 className="font-semibold text-emerald-400">
                    Productos a Comprar
                  </h3>

                  <button
                    type="button"
                    onClick={addItem}
                    className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
                  >
                    + Añadir Producto
                  </button>

                </div>

                {items.length === 0 && (

                  <p className="text-sm text-gray-500 py-2">
                    No hay productos agregados.
                  </p>

                )}

                <div className="space-y-2">

                  {items.map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        key={index}
                        className="flex gap-2 items-end bg-gray-900 p-3 rounded border border-gray-750"
                      >

                        {/* PRODUCTO */}

                        <div className="flex-1">

                          <label className="block text-xs text-gray-400 mb-1">
                            Producto
                          </label>

                          <select
                            value={
                              item.productId
                            }
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                'productId',
                                e.target.value
                              )
                            }
                            className="w-full bg-gray-800 border border-gray-700 p-2 rounded text-white text-sm"
                            required
                          >

                            <option value="">
                              Seleccionar...
                            </option>

                            {products.map(
                              (p) => (

                                <option
                                  key={p.id}
                                  value={p.id}
                                >
                                  {p.name}
                                </option>

                              )
                            )}

                          </select>

                        </div>

                        {/* CANTIDAD */}

                        <div className="w-24">

                          <label className="block text-xs text-gray-400 mb-1">
                            Cant.
                          </label>

                          <input
                            type="number"
                            min="1"
                            value={
                              item.quantity
                            }
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                'quantity',
                                e.target.value
                              )
                            }
                            className="w-full bg-gray-800 border border-gray-700 p-2 rounded text-white text-sm"
                            required
                          />

                        </div>

                        {/* COSTO */}

                        <div className="w-32">

                          <label className="block text-xs text-gray-400 mb-1">
                            Costo Unit ($)
                          </label>

                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={
                              item.unitCost
                            }
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                'unitCost',
                                e.target.value
                              )
                            }
                            className="w-full bg-gray-800 border border-gray-700 p-2 rounded text-white text-sm"
                            required
                          />

                        </div>

                        {/* SUBTOTAL */}

                        <div className="w-32">

                          <label className="block text-xs text-gray-400 mb-1">
                            Subtotal
                          </label>

                          <div className="p-2 bg-gray-800 border border-gray-700 rounded text-sm text-emerald-400 font-bold">
                            $
                            {Number(
                              item.subtotal
                            ).toFixed(2)}
                          </div>

                        </div>

                        {/* ELIMINAR */}

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(
                              index
                            )
                          }
                          className="p-2 bg-rose-600 hover:bg-rose-500 rounded text-white transition"
                          title="Eliminar fila"
                        >
                          X
                        </button>

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* TOTAL */}

              <div className="flex justify-between items-center border-t border-gray-700 pt-4 mt-4">

                <div className="text-xl font-bold text-white">

                  Total de la Orden:{' '}

                  <span className="text-emerald-400">
                    $
                    {totalAmount.toFixed(
                      2
                    )}
                  </span>

                </div>

                <div className="flex gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      setShowModal(
                        false
                      )
                    }
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-sm font-semibold transition"
                  >
                    {editingPurchaseId
                      ? 'Guardar Cambios'
                      : 'Registrar Compra'}
                  </button>

                </div>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}
