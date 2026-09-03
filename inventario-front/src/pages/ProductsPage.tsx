import { useState, useEffect } from 'react';
import api from '../api/axios';

export function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  // Estados para el modal de Crear/Editar Producto
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Imagen
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Datos del producto
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    description: '',
    categoryId: '',
    supplierId: '',
    costPrice: 0,
    unitPrice: 0,
    minStock: 0,
    maxStock: 0
  });

  // ==========================================
  // CARGAR DATOS
  // ==========================================

  const fetchData = async () => {
    try {
      const [prodRes, catRes, supRes] = await Promise.allSettled([
        api.get('/products'),
        api.get('/categories'),
        api.get('/suppliers')
      ]);

      if (prodRes.status === 'fulfilled') {
        setProducts(
          Array.isArray(prodRes.value.data)
            ? prodRes.value.data
            : prodRes.value.data?.data || []
        );
      }

      if (catRes.status === 'fulfilled') {
        setCategories(
          Array.isArray(catRes.value.data)
            ? catRes.value.data
            : catRes.value.data?.data || []
        );
      }

      if (supRes.status === 'fulfilled') {
        setSuppliers(
          Array.isArray(supRes.value.data)
            ? supRes.value.data
            : supRes.value.data?.data || []
        );
      }

    } catch (error) {
      console.error("Error al cargar datos", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // ABRIR MODAL CREAR
  // ==========================================

  const handleOpenCreateModal = async () => {
    setEditingProductId(null);
    setImageFile(null);
    setImagePreview(null);

    try {
      const res = await api.get('/products/next-sku');

      setNewProduct({
        sku: res.data.sku || '',
        name: '',
        description: '',
        categoryId: '',
        supplierId: '',
        costPrice: 0,
        unitPrice: 0,
        minStock: 0,
        maxStock: 0
      });

    } catch (error) {

      console.error(
        "Error al obtener el SKU sugerido",
        error
      );

      setNewProduct({
        sku: '',
        name: '',
        description: '',
        categoryId: '',
        supplierId: '',
        costPrice: 0,
        unitPrice: 0,
        minStock: 0,
        maxStock: 0
      });
    }

    setIsCreateModalOpen(true);
  };

  // ==========================================
  // ABRIR MODAL EDITAR
  // ==========================================

  const handleOpenEditModal = (prod: any) => {

    setEditingProductId(prod.id);

    setImageFile(null);

    setImagePreview(
      prod.imageUrl ||
      prod.imagen ||
      null
    );

    setNewProduct({
      sku: prod.sku || '',

      name: prod.name || '',

      description:
        prod.description ||
        prod.descripcion ||
        '',

      categoryId:
        prod.categoryId ||
        '',

      supplierId:
        prod.supplierId ||
        '',

      costPrice:
        prod.costPrice ??
        prod.precio_costo ??
        0,

      unitPrice:
        prod.unitPrice ??
        prod.precio_unitario ??
        0,

      minStock:
        prod.minStock ??
        prod.stock_minimo ??
        0,

      maxStock:
        prod.maxStock ??
        prod.stock_maximo ??
        0
    });

    setIsCreateModalOpen(true);
  };

  // ==========================================
  // ELIMINAR PRODUCTO
  // ==========================================

  const handleDeleteProduct = async (
    id: string,
    name: string
  ) => {

    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar (desactivar) el producto "${name}"?`
      )
    ) {

      try {

        await api.delete(
          `/products/${id}`
        );

        alert(
          '¡Producto eliminado correctamente!'
        );

        fetchData();

      } catch (error: any) {

        console.error(
          "Error al eliminar el producto",
          error
        );

        alert(
          error.response?.data?.error ||
          'No se pudo eliminar el producto'
        );
      }
    }
  };

  // ==========================================
  // SELECCIONAR IMAGEN
  // ==========================================

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    if (
      e.target.files &&
      e.target.files[0]
    ) {

      const file =
        e.target.files[0];

      setImageFile(file);

      setImagePreview(
        URL.createObjectURL(file)
      );
    }
  };

  // ==========================================
  // GUARDAR PRODUCTO
  // ==========================================

  const handleSaveProduct = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const formData =
        new FormData();

      // ======================================
      // DATOS DEL PRODUCTO
      // ======================================

      formData.append(
        "name",
        newProduct.name
      );

      formData.append(
        "description",
        newProduct.description
      );

      formData.append(
        "categoryId",
        newProduct.categoryId
      );

      formData.append(
        "supplierId",
        newProduct.supplierId
      );

      formData.append(
        "costPrice",
        String(
          newProduct.costPrice
        )
      );

      formData.append(
        "unitPrice",
        String(
          newProduct.unitPrice
        )
      );

      formData.append(
        "minStock",
        String(
          newProduct.minStock
        )
      );

      formData.append(
        "maxStock",
        String(
          newProduct.maxStock
        )
      );

      // ======================================
      // IMAGEN
      // ======================================

      if (imageFile) {

        console.log(
          "IMAGEN QUE SE ENVÍA:",
          imageFile.name
        );

        console.log(
          "TIPO:",
          imageFile.type
        );

        console.log(
          "TAMAÑO:",
          imageFile.size
        );

        formData.append(
          "imagen",
          imageFile
        );

      } else {

        console.log(
          "NO SE SELECCIONÓ IMAGEN"
        );
      }

      // ======================================
      // DEBUG FORMDATA
      // ======================================

      console.log(
        "========== FORMDATA =========="
      );

      for (
        const [
          key,
          value
        ] of formData.entries()
      ) {

        console.log(
          key,
          value
        );
      }

      console.log(
        "=============================="
      );

      // ======================================
      // CREAR
      // ======================================

      if (!editingProductId) {

        const response =
          await api.post(
            "/products",
            formData
          );

        console.log(
          "RESPUESTA CREAR:",
          response.data
        );

        alert(
          "¡Producto creado con éxito!"
        );

      } else {

        // ====================================
        // ACTUALIZAR
        // ====================================

        const response =
          await api.put(
            `/products/${editingProductId}`,
            formData
          );

        console.log(
          "RESPUESTA ACTUALIZAR:",
          response.data
        );

        alert(
          "¡Producto actualizado con éxito!"
        );
      }

      // ======================================
      // LIMPIAR FORMULARIO
      // ======================================

      setIsCreateModalOpen(false);

      setEditingProductId(null);

      setImageFile(null);

      setImagePreview(null);

      setNewProduct({
        sku: "",
        name: "",
        description: "",
        categoryId: "",
        supplierId: "",
        costPrice: 0,
        unitPrice: 0,
        minStock: 0,
        maxStock: 0,
      });

      await fetchData();

    } catch (error: any) {

      console.error(
        "===================================="
      );

      console.error(
        "ERROR AL GUARDAR PRODUCTO"
      );

      console.error(
        error
      );

      console.error(
        error?.response?.data
      );

      console.error(
        "===================================="
      );

      alert(
        error?.response?.data?.details ||
        error?.response?.data?.error ||
        "No se pudo guardar el producto"
      );
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">

      {/* ======================================
          CABECERA
      ======================================= */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold mb-2">
            Gestión de Productos
          </h1>

          <p className="text-gray-400">
            Control de inventario, SKU, precios,
            categorías y descripciones.
          </p>

        </div>

        <button
          onClick={
            handleOpenCreateModal
          }
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
        >
          + Nuevo Producto
        </button>

      </div>

      {/* ======================================
          TABLA DE PRODUCTOS
      ======================================= */}

      <div className="bg-gray-800 rounded-lg shadow-md overflow-x-auto">

        <table className="w-full text-left border-collapse">

          <thead>

            <tr className="border-b border-gray-700 text-gray-400 text-sm">

              <th className="p-4">
                IMAGEN
              </th>

              <th className="p-4">
                SKU
              </th>

              <th className="p-4">
                NOMBRE
              </th>

              <th className="p-4">
                DESCRIPCIÓN
              </th>

              <th className="p-4">
                CATEGORÍA
              </th>

              <th className="p-4">
                PRECIO COMPRA
              </th>

              <th className="p-4">
                PRECIO VENTA
              </th>

              <th className="p-4">
                TOTAL ASIGNADO
              </th>

              <th className="p-4 text-right">
                ACCIONES
              </th>

            </tr>

          </thead>

          <tbody>

            {products.map(
              (prod: any) => {

                const list =
                  prod.shareholders ||
                  prod.shareholderProducts ||
                  prod.accionistas_productos ||
                  [];

                const totalAssigned =
                  list.reduce(
                    (
                      acc: number,
                      sp: any
                    ) =>
                      acc +
                      (
                        sp.quantity ||
                        sp.cantidad ||
                        0
                      ),
                    0
                  );

                const productImg =
                  prod.imageUrl ||
                  prod.imagen;

                const description =
                  prod.description ||
                  prod.descripcion ||
                  '';

                return (

                  <tr
                    key={prod.id}
                    className="border-b border-gray-700 hover:bg-gray-700/50"
                  >

                    {/* IMAGEN */}

                    <td className="p-4">

                      {productImg ? (

                        <img
                          src={productImg}
                          alt={prod.name}
                          className="w-10 h-10 object-cover rounded"
                        />

                      ) : (

                        <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400">
                          Sin img
                        </div>

                      )}

                    </td>

                    {/* SKU */}

                    <td className="p-4 text-indigo-300 font-medium">
                      {prod.sku}
                    </td>

                    {/* NOMBRE */}

                    <td className="p-4">
                      {prod.name}
                    </td>

                    {/* DESCRIPCIÓN */}

                    <td className="p-4 max-w-xs">

                      {description ? (

                        <div
                          className="text-gray-300 text-sm line-clamp-3"
                          title={description}
                        >
                          {description}
                        </div>

                      ) : (

                        <span className="text-gray-500 text-sm">
                          Sin descripción
                        </span>

                      )}

                    </td>

                    {/* CATEGORÍA */}

                    <td className="p-4">

                      <span className="bg-gray-700 px-2 py-1 rounded text-xs">

                        {
                          prod.category?.name ||
                          'Sin categoría'
                        }

                      </span>

                    </td>

                    {/* PRECIO COMPRA */}

                    <td className="p-4 text-gray-300">

                      $
                      {
                        prod.costPrice ??
                        prod.precio_costo ??
                        0
                      }

                    </td>

                    {/* PRECIO VENTA */}

                    <td className="p-4 text-green-400 font-semibold">

                      $
                      {
                        prod.unitPrice ??
                        prod.precio_unitario ??
                        0
                      }

                    </td>

                    {/* TOTAL ASIGNADO */}

                    <td className="p-4 font-bold text-indigo-400">

                      {totalAssigned} un.

                    </td>

                    {/* ACCIONES */}

                    <td className="p-4 text-right">

                      <div className="flex items-center justify-end gap-2">

                        {/* EDITAR */}

                        <button
                          onClick={() =>
                            handleOpenEditModal(
                              prod
                            )
                          }
                          title="Editar Producto"
                          className="p-2 bg-gray-700 hover:bg-indigo-600 text-gray-300 hover:text-white rounded-lg transition"
                        >

                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >

                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />

                          </svg>

                        </button>

                        {/* ELIMINAR */}

                        <button
                          onClick={() =>
                            handleDeleteProduct(
                              prod.id,
                              prod.name
                            )
                          }
                          title="Eliminar Producto"
                          className="p-2 bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white rounded-lg transition"
                        >

                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >

                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 01-1 1v3M4 7h16"
                            />

                          </svg>

                        </button>

                      </div>

                    </td>

                  </tr>

                );

              }
            )}

          </tbody>

        </table>

      </div>

      {/* ======================================
          MODAL CREAR / EDITAR
      ======================================= */}

      {isCreateModalOpen && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">

          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full shadow-xl border border-gray-700 max-h-[90vh] overflow-y-auto">

            {/* TITULO */}

            <h2 className="text-xl font-bold mb-4 text-indigo-400">

              {
                editingProductId
                  ? 'Editar Producto'
                  : 'Crear Nuevo Producto'
              }

            </h2>

            <form
              onSubmit={
                handleSaveProduct
              }
              className="space-y-4"
            >

              {/* =================================
                  SKU
              ================================== */}

              <div>

                <label className="block text-sm text-gray-300 mb-1">
                  SKU
                </label>

                <input
                  type="text"
                  value={
                    newProduct.sku
                  }
                  readOnly={
                    !editingProductId
                  }
                  className={`w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none ${
                    !editingProductId
                      ? 'cursor-not-allowed opacity-80'
                      : 'focus:border-indigo-500'
                  }`}
                  required
                />

                {!editingProductId && (

                  <p className="text-xs text-gray-400 mt-1">
                    El SKU se genera automáticamente
                    y no se puede modificar.
                  </p>

                )}

              </div>

              {/* =================================
                  NOMBRE
              ================================== */}

              <div>

                <label className="block text-sm text-gray-300 mb-1">
                  Nombre
                </label>

                <input
                  type="text"
                  value={
                    newProduct.name
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      name: e.target.value
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                  required
                />

              </div>

              {/* =================================
                  DESCRIPCIÓN LARGA
              ================================== */}

              <div>

                <label className="block text-sm text-gray-300 mb-1">
                  Descripción del Producto
                </label>

                <textarea
                  value={
                    newProduct.description
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description:
                        e.target.value
                    })
                  }
                  placeholder="Escribe aquí una descripción detallada del producto..."
                  rows={6}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500 resize-y"
                />

                <p className="text-xs text-gray-400 mt-1">
                  Puedes agregar características,
                  especificaciones, materiales,
                  detalles y otra información
                  del producto.
                </p>

              </div>

              {/* =================================
                  IMAGEN
              ================================== */}

              <div>

                <label className="block text-sm text-gray-300 mb-1">
                  Imagen del Producto
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                />

                {imagePreview && (

                  <div className="mt-2">

                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      className="w-20 h-20 object-cover rounded border border-gray-600"
                    />

                  </div>

                )}

              </div>

              {/* =================================
                  CATEGORÍA
              ================================== */}

              <div>

                <label className="block text-sm text-gray-300 mb-1">
                  Categoría
                </label>

                <select
                  value={
                    newProduct.categoryId
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      categoryId:
                        e.target.value
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                  required
                >

                  <option value="">
                    -- Seleccione Categoría --
                  </option>

                  {categories.map(
                    (cat: any) => (

                      <option
                        key={cat.id}
                        value={cat.id}
                      >
                        {cat.name}
                      </option>

                    )
                  )}

                </select>

              </div>

              {/* =================================
                  PROVEEDOR
              ================================== */}

              <div>

                <label className="block text-sm text-gray-300 mb-1">
                  Proveedor
                </label>

                <select
                  value={
                    newProduct.supplierId
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      supplierId:
                        e.target.value
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                  required
                >

                  <option value="">
                    -- Seleccione Proveedor --
                  </option>

                  {suppliers.map(
                    (sup: any) => (

                      <option
                        key={sup.id}
                        value={sup.id}
                      >
                        {sup.name}
                      </option>

                    )
                  )}

                </select>

              </div>

              {/* =================================
                  STOCK MÍNIMO
              ================================== */}

              <div>

                <label className="block text-sm text-gray-300 mb-1">
                  Stock Mínimo
                </label>

                <input
                  type="number"
                  min="0"
                  value={
                    newProduct.minStock
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      minStock:
                        Number(
                          e.target.value
                        )
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                  required
                />

              </div>

              {/* =================================
                  STOCK MÁXIMO
              ================================== */}

              <div>

                <label className="block text-sm text-gray-300 mb-1">
                  Stock Máximo
                </label>

                <input
                  type="number"
                  min="0"
                  value={
                    newProduct.maxStock
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      maxStock:
                        Number(
                          e.target.value
                        )
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                  required
                />

              </div>

              {/* =================================
                  PRECIO COMPRA
              ================================== */}

              <div>

                <label className="block text-sm text-gray-300 mb-1">
                  Precio Compra
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={
                    newProduct.costPrice
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      costPrice:
                        Number(
                          e.target.value
                        )
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                  required
                />

              </div>

              {/* =================================
                  PRECIO VENTA
              ================================== */}

              <div>

                <label className="block text-sm text-gray-300 mb-1">
                  Precio Venta
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={
                    newProduct.unitPrice
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      unitPrice:
                        Number(
                          e.target.value
                        )
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                  required
                />

              </div>

              {/* =================================
                  BOTONES
              ================================== */}

              <div className="flex justify-end space-x-3 mt-6">

                <button
                  type="button"
                  onClick={() =>
                    setIsCreateModalOpen(
                      false
                    )
                  }
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-semibold transition"
                >
                  {
                    editingProductId
                      ? 'Actualizar Producto'
                      : 'Guardar Producto'
                  }
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}
