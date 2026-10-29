import { useEffect, useState } from "react";
import api from "../api/axios";

interface ProductImage {
  id: string;
  productId: string;
  url: string;
}

interface Product {
  id: string;
  sku?: string;
  name?: string;
  description?: string;

  categoryId?: string;
  supplierId?: string;

  costPrice?: number;
  unitPrice?: number;

  // Oferta
  isOnSale?: boolean;
  salePrice?: number;
  esta_en_oferta?: boolean;
  precio_oferta?: number;

  // TikTok URL
  tiktokUrl?: string;
  tiktok_url?: string;

  minStock?: number;
  maxStock?: number;

  precio_costo?: number;
  precio_unitario?: number;
  stock_minimo?: number;
  stock_maximo?: number;

  imageUrl?: string;
  imagen?: string;

  images?: ProductImage[];

  category?: {
    id?: string;
    name?: string;
  };

  shareholders?: any[];
  shareholderProducts?: any[];
  accionistas_productos?: any[];
}

interface Category {
  id: string;
  name: string;
}

interface Supplier {
  id: string;
  name: string;
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [loading, setLoading] = useState(true);

  // ============================================================
  // MODAL
  // ============================================================

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editingProductId, setEditingProductId] =
    useState<string | null>(null);

  // ============================================================
  // IMÁGENES
  // ============================================================

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // ============================================================
  // BUSCADOR
  // ============================================================

  const [searchTerm, setSearchTerm] = useState("");

  // ============================================================
  // PAGINACIÓN
  // ============================================================

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ============================================================
  // PRODUCTO
  // ============================================================

  const emptyProduct = {
    sku: "",
    name: "",
    description: "",
    categoryId: "",
    supplierId: "",
    costPrice: 0,
    unitPrice: 0,
    isOnSale: false,
    salePrice: 0,
    tiktokUrl: "",
    minStock: 0,
    maxStock: 0,
  };

  const [newProduct, setNewProduct] = useState(emptyProduct);

  // ============================================================
  // CARGAR DATOS
  // ============================================================

  const fetchData = async () => {
    try {
      setLoading(true);

      const [prodRes, catRes, supRes] =
        await Promise.allSettled([
          api.get("/products"),
          api.get("/categories"),
          api.get("/suppliers"),
        ]);

      if (prodRes.status === "fulfilled") {
        const data = prodRes.value.data;

        const productsData = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];

        setProducts(productsData);
      }

      if (catRes.status === "fulfilled") {
        const data = catRes.value.data;

        const categoriesData = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];

        setCategories(categoriesData);
      }

      if (supRes.status === "fulfilled") {
        const data = supRes.value.data;

        const suppliersData = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];

        setSuppliers(suppliersData);
      }
    } catch (error) {
      console.error(
        "Error al cargar datos:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ============================================================
  // LIMPIAR PREVIEWS
  // ============================================================

  const revokeBlobPreviews = () => {
    imagePreviews.forEach((preview) => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    });
  };

  // ============================================================
  // ABRIR MODAL CREAR
  // ============================================================

  const handleOpenCreateModal = async () => {
    setEditingProductId(null);

    revokeBlobPreviews();

    setImageFiles([]);
    setImagePreviews([]);

    try {
      const res = await api.get(
        "/products/next-sku"
      );

      setNewProduct({
        ...emptyProduct,
        sku: res.data?.sku || "",
      });
    } catch (error) {
      console.error(
        "Error al obtener el SKU sugerido:",
        error
      );

      setNewProduct(emptyProduct);
    }

    setIsCreateModalOpen(true);
  };

  // ============================================================
  // OBTENER IMÁGENES DEL PRODUCTO
  // ============================================================

  const getProductImages = (
    prod: Product
  ): string[] => {
    const images: string[] = [];

    if (prod.imageUrl) {
      images.push(prod.imageUrl);
    } else if (prod.imagen) {
      images.push(prod.imagen);
    }

    if (Array.isArray(prod.images)) {
      prod.images.forEach((image) => {
        if (
          image?.url &&
          !images.includes(image.url)
        ) {
          images.push(image.url);
        }
      });
    }

    return images;
  };

  // ============================================================
  // ABRIR MODAL EDITAR
  // ============================================================

  const handleOpenEditModal = (
    prod: Product
  ) => {
    setEditingProductId(prod.id);

    revokeBlobPreviews();

    setImageFiles([]);

    const existingImages =
      getProductImages(prod);

    setImagePreviews(existingImages);

    setNewProduct({
      sku: prod.sku || "",
      name: prod.name || "",
      description: prod.description || "",

      categoryId:
        prod.categoryId || "",

      supplierId:
        prod.supplierId || "",

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
        0,

      isOnSale:
        prod.isOnSale ??
        prod.esta_en_oferta ??
        false,

      salePrice:
        prod.salePrice ??
        prod.precio_oferta ??
        0,

      tiktokUrl:
        prod.tiktokUrl ??
        prod.tiktok_url ??
        "",
    });

    setIsCreateModalOpen(true);
  };

  // ============================================================
  // CERRAR MODAL
  // ============================================================

  const handleCloseModal = () => {
    revokeBlobPreviews();

    setIsCreateModalOpen(false);

    setEditingProductId(null);

    setImageFiles([]);
    setImagePreviews([]);

    setNewProduct(emptyProduct);
  };

  // ============================================================
  // CAMBIO DE IMÁGENES
  // ============================================================

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      e.target.files || []
    );

    if (files.length === 0) {
      return;
    }

    const validFiles: File[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        alert(
          `El archivo "${file.name}" no es una imagen válida.`
        );
        continue;
      }

      if (
        file.size >
        5 * 1024 * 1024
      ) {
        alert(
          `La imagen "${file.name}" supera los 5 MB.`
        );
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      e.target.value = "";
      return;
    }

    setImageFiles((prev) => [...prev, ...validFiles]);

    const newPreviewUrls =
      validFiles.map((file) =>
        URL.createObjectURL(file)
      );

    setImagePreviews((prev) => {
      const totalImages =
        prev.length +
        validFiles.length;

      if (totalImages > 10) {
        alert(
          "Puedes tener un máximo de 10 imágenes."
        );

        newPreviewUrls.forEach(
          (url) => {
            URL.revokeObjectURL(url);
          }
        );

        return prev;
      }

      return [
        ...prev,
        ...newPreviewUrls,
      ];
    });

    e.target.value = "";
  };

  // ============================================================
  // ELIMINAR IMAGEN
  // ============================================================

  const handleRemoveImage = (
    index: number
  ) => {
    const preview =
      imagePreviews[index];

    if (
      preview?.startsWith("blob:")
    ) {
      URL.revokeObjectURL(preview);
    }

    const blobIndexes: number[] = [];

    imagePreviews.forEach(
      (item, i) => {
        if (
          item.startsWith("blob:")
        ) {
          blobIndexes.push(i);
        }
      }
    );

    const blobPosition =
      blobIndexes.indexOf(index);

    if (blobPosition !== -1) {
      setImageFiles((prev) =>
        prev.filter(
          (_, i) =>
            i !== blobPosition
        )
      );
    }

    setImagePreviews((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  // ============================================================
  // GUARDAR PRODUCTO
  // ============================================================

  const handleSaveProduct = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      if (!newProduct.name.trim()) {
        alert("El nombre del producto es obligatorio.");
        return;
      }

      if (!newProduct.categoryId) {
        alert("Debes seleccionar una categoría.");
        return;
      }

      if (!newProduct.supplierId) {
        alert("Debes seleccionar un proveedor.");
        return;
      }

      if (newProduct.costPrice < 0) {
        alert("El precio de compra no puede ser negativo.");
        return;
      }

      if (newProduct.unitPrice < 0) {
        alert("El precio de venta no puede ser negativo.");
        return;
      }

      if (newProduct.minStock < 0) {
        alert("El stock mínimo no puede ser negativo.");
        return;
      }

      if (newProduct.maxStock < 0) {
        alert("El stock máximo no puede ser negativo.");
        return;
      }

      if (
        newProduct.maxStock > 0 &&
        newProduct.maxStock < newProduct.minStock
      ) {
        alert("El stock máximo no puede ser menor que el stock mínimo.");
        return;
      }

      // VALIDAR OFERTA
      if (newProduct.isOnSale) {
        if (!newProduct.salePrice || newProduct.salePrice <= 0) {
          alert("El precio de oferta debe ser mayor a 0.");
          return;
        }

        if (newProduct.salePrice >= newProduct.unitPrice) {
          alert("El precio de oferta debe ser menor que el precio normal.");
          return;
        }
      }

      const formData = new FormData();

      formData.append("sku", newProduct.sku);
      formData.append("name", newProduct.name.trim());
      formData.append("description", newProduct.description?.trim() || "");
      formData.append("categoryId", newProduct.categoryId);
      formData.append("supplierId", newProduct.supplierId);
      formData.append("costPrice", String(newProduct.costPrice));
      formData.append("unitPrice", String(newProduct.unitPrice));
      formData.append("minStock", String(newProduct.minStock));
      formData.append("maxStock", String(newProduct.maxStock));

      // TIKTOK URL
      formData.append("tiktokUrl", newProduct.tiktokUrl?.trim() || "");

      // OFERTA
      formData.append("isOnSale", String(newProduct.isOnSale));
      formData.append(
        "salePrice",
        newProduct.isOnSale ? String(newProduct.salePrice ?? "") : ""
      );

      // IMÁGENES
      imageFiles.forEach((file) => {
        formData.append("imagenes", file);
      });

      if (!editingProductId) {
        await api.post("/products", formData);
        alert("¡Producto creado con éxito!");
      } else {
        await api.put(`/products/${editingProductId}`, formData);
        alert("¡Producto actualizado con éxito!");
      }

      handleCloseModal();
      setCurrentPage(1);
      await fetchData();
    } catch (error: any) {
      console.error("ERROR AL GUARDAR PRODUCTO:", error);
      alert(
        error?.response?.data?.details ||
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "No se pudo guardar el producto"
      );
    }
  };

  // ============================================================
  // ELIMINAR PRODUCTO
  // ============================================================

  const handleDeleteProduct = async (
    id: string,
    name: string
  ) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar (desactivar) el producto "${name}"?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/products/${id}`);
      alert("¡Producto eliminado correctamente!");
      await fetchData();
    } catch (error: any) {
      console.error("Error al eliminar el producto:", error);
      alert(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "No se pudo eliminar el producto"
      );
    }
  };

  // ============================================================
  // FILTRAR
  // ============================================================

  const filteredProducts = products.filter((prod) => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return true;

    const sku = (prod.sku || "").toLowerCase();
    const name = (prod.name || "").toLowerCase();
    const category = (prod.category?.name || "").toLowerCase();

    return (
      sku.includes(search) ||
      name.includes(search) ||
      category.includes(search)
    );
  });

  // ============================================================
  // PAGINACIÓN
  // ============================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / itemsPerPage)
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Productos</h1>
          <p className="text-gray-400">
            Control de inventario, SKU, precios, categorías y enlaces a redes.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 cursor-pointer"
        >
          + Nuevo Producto
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="mb-6 flex flex-col md:flex-row gap-3 justify-between">
        <input
          type="text"
          placeholder="Buscar por SKU, nombre o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
        />

        <div className="text-sm text-gray-400 flex items-center">
          {filteredProducts.length} producto
          {filteredProducts.length !== 1 ? "s" : ""} encontrado
          {filteredProducts.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-gray-800 rounded-xl shadow-md overflow-x-auto border border-gray-700">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-sm">
              <th className="p-4">IMAGEN</th>
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
            {loading ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-400">
                  Cargando productos...
                </td>
              </tr>
            ) : paginatedProducts.length > 0 ? (
              paginatedProducts.map((prod) => {
                const list =
                  prod.shareholders ||
                  prod.shareholderProducts ||
                  prod.accionistas_productos ||
                  [];

                const totalAssigned = list.reduce(
                  (acc: number, sp: any) =>
                    acc + Number(sp.quantity ?? sp.cantidad ?? 0),
                  0
                );

                const productImages = getProductImages(prod);
                const productImg = productImages[0];
                const tiktokLink = prod.tiktokUrl || prod.tiktok_url;

                return (
                  <tr
                    key={prod.id}
                    className="border-b border-gray-700 hover:bg-gray-700/50 transition"
                  >
                    {/* IMAGEN */}
                    <td className="p-4">
                      {productImg ? (
                        <img
                          src={productImg}
                          alt={prod.name || "Producto"}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-600"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-400">
                          Sin img
                        </div>
                      )}
                    </td>

                    {/* SKU */}
                    <td className="p-4 text-indigo-300 font-medium">
                      {prod.sku || "N/A"}
                    </td>

                    {/* NOMBRE */}
                    <td className="p-4 font-medium">
                      {prod.name || "Sin nombre"}
                    </td>

                    {/* CATEGORÍA */}
                    <td className="p-4">
                      <span className="bg-gray-700 px-2 py-1 rounded text-xs">
                        {prod.category?.name || "Sin categoría"}
                      </span>
                    </td>

                    {/* PRECIO COMPRA */}
                    <td className="p-4 text-gray-300">
                      $
                      {Number(
                        prod.costPrice ?? prod.precio_costo ?? 0
                      ).toFixed(2)}
                    </td>

                    {/* PRECIO VENTA / OFERTA */}
                    <td className="p-4 font-semibold">
                      {Boolean(prod.isOnSale ?? prod.esta_en_oferta) ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-400 line-through text-sm">
                            $
                            {Number(
                              prod.unitPrice ?? prod.precio_unitario ?? 0
                            ).toFixed(2)}
                          </span>
                          <span className="text-green-400 font-bold">
                            $
                            {Number(
                              prod.salePrice ?? prod.precio_oferta ?? 0
                            ).toFixed(2)}
                          </span>
                          <span className="inline-flex w-fit px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 text-xs font-bold">
                            OFERTA
                          </span>
                        </div>
                      ) : (
                        <span className="text-green-400">
                          $
                          {Number(
                            prod.unitPrice ?? prod.precio_unitario ?? 0
                          ).toFixed(2)}
                        </span>
                      )}
                    </td>

                    {/* STOCK */}
                    <td className="p-4 font-bold text-indigo-400">
                      {totalAssigned} un.
                    </td>

                    {/* ACCIONES */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Botón de TikTok */}
                        {tiktokLink ? (
                          <a
                            href={tiktokLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Ver en TikTok"
                            className="p-2 bg-black hover:bg-gray-900 text-pink-400 hover:text-pink-300 rounded-lg transition border border-gray-700 flex items-center justify-center"
                          >
                            🎵
                          </a>
                        ) : null}

                        {/* Editar */}
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          title="Editar Producto"
                          className="p-2 bg-gray-700 hover:bg-indigo-600 text-gray-300 hover:text-white rounded-lg transition cursor-pointer"
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

                        {/* Eliminar */}
                        <button
                          onClick={() =>
                            handleDeleteProduct(
                              prod.id,
                              prod.name || "este producto"
                            )
                          }
                          title="Eliminar Producto"
                          className="p-2 bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white rounded-lg transition cursor-pointer"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-400">
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL CREAR / EDITAR */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-white">
              {editingProductId ? "Editar Producto" : "Nuevo Producto"}
            </h2>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SKU */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, sku: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* NOMBRE */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* CATEGORÍA */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Categoría *
                  </label>
                  <select
                    required
                    value={newProduct.categoryId}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, categoryId: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PROVEEDOR */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Proveedor *
                  </label>
                  <select
                    required
                    value={newProduct.supplierId}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, supplierId: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Selecciona un proveedor</option>
                    {suppliers.map((sup) => (
                      <option key={sup.id} value={sup.id}>
                        {sup.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PRECIO COMPRA */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Precio Compra ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.costPrice}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, costPrice: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* PRECIO VENTA */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Precio Venta ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.unitPrice}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, unitPrice: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* STOCK MÍNIMO */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Stock Mínimo
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.minStock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, minStock: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* STOCK MÁXIMO */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Stock Máximo
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.maxStock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, maxStock: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* TIKTOK URL */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Enlace de TikTok (Video / Demostración)
                </label>
                <input
                  type="url"
                  placeholder="https://www.tiktok.com/@usuario/video/123456789"
                  value={newProduct.tiktokUrl}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, tiktokUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* OFERTA */}
              <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-200">
                  <input
                    type="checkbox"
                    checked={newProduct.isOnSale}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, isOnSale: e.target.checked })
                    }
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  ¿Este producto está en oferta?
                </label>

                {newProduct.isOnSale && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Precio de Oferta ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.salePrice}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, salePrice: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
              </div>

              {/* DESCRIPCIÓN */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* IMÁGENES */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Imágenes del Producto (Máx. 10)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                />

                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative group w-16 h-16">
                        <img
                          src={preview}
                          alt="preview"
                          className="w-16 h-16 object-cover rounded-lg border border-slate-700"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-90 hover:opacity-100 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BOTONES DE ACCIÓN */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition cursor-pointer"
                >
                  {editingProductId ? "Guardar Cambios" : "Crear Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;