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

function ProductsPage() {
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
    categoryId: "",
    supplierId: "",
    costPrice: 0,
    unitPrice: 0,
    isOnSale: false,
    salePrice: 0,
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

    console.log(
      "📸 ARCHIVOS SELECCIONADOS:",
      files.length
    );

    console.log(
      "📸 NOMBRES SELECCIONADOS:",
      files.map(
        (file) => file.name
      )
    );

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

    setImageFiles((prev) => {
      const updatedFiles = [
        ...prev,
        ...validFiles,
      ];

      console.log(
        "📦 TOTAL imageFiles:",
        updatedFiles.length
      );

      console.log(
        "📦 ARCHIVOS imageFiles:",
        updatedFiles.map(
          (file) => file.name
        )
      );

      return updatedFiles;
    });

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

    /*
     * Limpiamos el input para permitir
     * volver a seleccionar archivos.
     *
     * Los archivos ya están guardados
     * en imageFiles.
     */
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

    /*
     * Los archivos nuevos son exactamente
     * los previews blob.
     *
     * Buscamos la posición del blob
     * correspondiente dentro de imageFiles.
     */

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
        alert(
          "El nombre del producto es obligatorio."
        );
        return;
      }

      if (!newProduct.categoryId) {
        alert(
          "Debes seleccionar una categoría."
        );
        return;
      }

      if (!newProduct.supplierId) {
        alert(
          "Debes seleccionar un proveedor."
        );
        return;
      }

      if (newProduct.costPrice < 0) {
        alert(
          "El precio de compra no puede ser negativo."
        );
        return;
      }

      if (newProduct.unitPrice < 0) {
        alert(
          "El precio de venta no puede ser negativo."
        );
        return;
      }

      if (newProduct.minStock < 0) {
        alert(
          "El stock mínimo no puede ser negativo."
        );
        return;
      }

      if (newProduct.maxStock < 0) {
        alert(
          "El stock máximo no puede ser negativo."
        );
        return;
      }

      if (
        newProduct.maxStock > 0 &&
        newProduct.maxStock <
          newProduct.minStock
      ) {
        alert(
          "El stock máximo no puede ser menor que el stock mínimo."
        );
        return;
      }

      // ========================================================
      // VALIDAR OFERTA
      // ========================================================

      if (newProduct.isOnSale) {
        if (
          !newProduct.salePrice ||
          newProduct.salePrice <= 0
        ) {
          alert(
            "El precio de oferta debe ser mayor a 0."
          );
          return;
        }

        if (
          newProduct.salePrice >=
          newProduct.unitPrice
        ) {
          alert(
            "El precio de oferta debe ser menor que el precio normal."
          );
          return;
        }
      }

      const formData =
        new FormData();

      formData.append(
        "sku",
        newProduct.sku
      );

      formData.append(
        "name",
        newProduct.name.trim()
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

      // ========================================================
      // OFERTA
      // ========================================================

      formData.append(
        "isOnSale",
        String(
          newProduct.isOnSale
        )
      );

      formData.append(
        "salePrice",
        newProduct.isOnSale
          ? String(
              newProduct.salePrice ??
                ""
            )
          : ""
      );

      // ========================================================
      // IMÁGENES
      // ========================================================

      console.log(
        "========================================"
      );

      console.log(
        "📤 PREPARANDO IMÁGENES"
      );

      console.log(
        "📤 TOTAL imageFiles:",
        imageFiles.length
      );

      console.log(
        "📤 NOMBRES:",
        imageFiles.map(
          (file) => file.name
        )
      );

      imageFiles.forEach(
        (file, index) => {
          console.log(
            `📤 ENVIANDO IMAGEN ${
              index + 1
            }:`,
            file.name
          );

          formData.append(
            "imagenes",
            file
          );
        }
      );

      console.log(
        "========================================"
      );

      // ========================================================
      // DEBUG FORM DATA
      // ========================================================

      console.log(
        "========== DATOS DEL PRODUCTO =========="
      );

      for (const [
        key,
        value,
      ] of formData.entries()) {
        if (
          value instanceof File
        ) {
          console.log(
            key,
            {
              nombre:
                value.name,
              tipo:
                value.type,
              tamaño:
                value.size,
            }
          );
        } else {
          console.log(
            key,
            value
          );
        }
      }

      console.log(
        "========================================"
      );

      // ========================================================
      // CREAR PRODUCTO
      // ========================================================

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
      }

      // ========================================================
      // ACTUALIZAR PRODUCTO
      // ========================================================

      else {
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

      handleCloseModal();

      setCurrentPage(1);

      await fetchData();
    } catch (error: any) {
      console.error(
        "===================================="
      );

      console.error(
        "ERROR AL GUARDAR PRODUCTO"
      );

      console.error(error);

      console.error(
        "RESPUESTA:",
        error?.response?.data
      );

      console.error(
        "===================================="
      );

      alert(
        error?.response?.data
          ?.details ||
          error?.response?.data
            ?.error ||
          error?.response?.data
            ?.message ||
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
    const confirmed =
      window.confirm(
        `¿Estás seguro de que deseas eliminar (desactivar) el producto "${name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/products/${id}`
      );

      alert(
        "¡Producto eliminado correctamente!"
      );

      await fetchData();

      const filteredLength =
        Math.max(
          0,
          products.length - 1
        );

      const newTotalPages =
        Math.max(
          1,
          Math.ceil(
            filteredLength /
              itemsPerPage
          )
        );

      if (
        currentPage >
        newTotalPages
      ) {
        setCurrentPage(
          newTotalPages
        );
      }
    } catch (error: any) {
      console.error(
        "Error al eliminar el producto:",
        error
      );

      alert(
        error?.response?.data
          ?.error ||
          error?.response?.data
            ?.message ||
          "No se pudo eliminar el producto"
      );
    }
  };

  // ============================================================
  // FILTRAR
  // ============================================================

  const filteredProducts =
    products.filter((prod) => {
      const search =
        searchTerm
          .toLowerCase()
          .trim();

      if (!search) {
        return true;
      }

      const sku =
        (
          prod.sku || ""
        ).toLowerCase();

      const name =
        (
          prod.name || ""
        ).toLowerCase();

      const category =
        (
          prod.category
            ?.name || ""
        ).toLowerCase();

      return (
        sku.includes(search) ||
        name.includes(search) ||
        category.includes(search)
      );
    });

  // ============================================================
  // PAGINACIÓN
  // ============================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredProducts.length /
          itemsPerPage
      )
    );

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const endIndex =
    startIndex +
    itemsPerPage;

  const paginatedProducts =
    filteredProducts.slice(
      startIndex,
      endIndex
    );

  // ============================================================
  // CAMBIAR PÁGINA
  // ============================================================

  const goToPage = (
    page: number
  ) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);
  };

  // ============================================================
  // REINICIAR PAGINACIÓN
  // ============================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    itemsPerPage,
  ]);

  // ============================================================
  // NÚMEROS DE PÁGINA
  // ============================================================

  const getPageNumbers = () => {
    const pages: number[] = [];

    if (totalPages <= 7) {
      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push(-1);
    }

    const start = Math.max(
      2,
      currentPage - 1
    );

    const end = Math.min(
      totalPages - 1,
      currentPage + 1
    );

    for (
      let i = start;
      i <= end;
      i++
    ) {
      pages.push(i);
    }

    if (
      currentPage <
      totalPages - 2
    ) {
      pages.push(-1);
    }

    pages.push(totalPages);

    return pages;
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">

      {/* CABECERA */}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">

        <div>
          <h1 className="text-3xl font-bold mb-2">
            Gestión de Productos
          </h1>

          <p className="text-gray-400">
            Control de inventario, SKU,
            precios y categorías.
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

      {/* BUSCADOR */}

      <div className="mb-6 flex flex-col md:flex-row gap-3 justify-between">

        <input
          type="text"
          placeholder="Buscar por SKU, nombre o categoría..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }
          className="w-full md:w-96 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
        />

        <div className="text-sm text-gray-400 flex items-center">
          {
            filteredProducts.length
          }{" "}
          producto
          {filteredProducts.length !==
          1
            ? "s"
            : ""}{" "}
          encontrado
          {filteredProducts.length !==
          1
            ? "s"
            : ""}
        </div>
      </div>

      {/* TABLA */}

      <div className="bg-gray-800 rounded-xl shadow-md overflow-x-auto border border-gray-700">

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

            {loading ? (

              <tr>
                <td
                  colSpan={8}
                  className="p-8 text-center text-gray-400"
                >
                  Cargando productos...
                </td>
              </tr>

            ) : paginatedProducts.length >
              0 ? (

              paginatedProducts.map(
                (prod) => {

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
                        Number(
                          sp.quantity ??
                            sp.cantidad ??
                            0
                        ),
                      0
                    );

                  const productImages =
                    getProductImages(
                      prod
                    );

                  const productImg =
                    productImages[0];

                  return (
                    <tr
                      key={
                        prod.id
                      }
                      className="border-b border-gray-700 hover:bg-gray-700/50 transition"
                    >

                      {/* IMAGEN */}

                      <td className="p-4">

                        {productImg ? (

                          <img
                            src={
                              productImg
                            }
                            alt={
                              prod.name ||
                              "Producto"
                            }
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
                        {prod.sku ||
                          "N/A"}
                      </td>

                      {/* NOMBRE */}

                      <td className="p-4 font-medium">
                        {prod.name ||
                          "Sin nombre"}
                      </td>

                      {/* CATEGORÍA */}

                      <td className="p-4">

                        <span className="bg-gray-700 px-2 py-1 rounded text-xs">
                          {prod
                            .category
                            ?.name ||
                            "Sin categoría"}
                        </span>

                      </td>

                      {/* PRECIO COMPRA */}

                      <td className="p-4 text-gray-300">

                        $
                        {Number(
                          prod.costPrice ??
                            prod.precio_costo ??
                            0
                        ).toFixed(
                          2
                        )}

                      </td>

                      {/* PRECIO VENTA / OFERTA */}

                      <td className="p-4 font-semibold">
                        {Boolean(
                          prod.isOnSale ??
                            prod.esta_en_oferta
                        ) ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-gray-400 line-through text-sm">
                              $
                              {Number(
                                prod.unitPrice ??
                                  prod.precio_unitario ??
                                  0
                              ).toFixed(2)}
                            </span>

                            <span className="text-green-400 font-bold">
                              $
                              {Number(
                                prod.salePrice ??
                                  prod.precio_oferta ??
                                  0
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
                              prod.unitPrice ??
                                prod.precio_unitario ??
                                0
                            ).toFixed(2)}
                          </span>
                        )}
                      </td>

                      {/* STOCK */}

                      <td className="p-4 font-bold text-indigo-400">

                        {
                          totalAssigned
                        }{" "}
                        un.

                      </td>

                      {/* ACCIONES */}

                      <td className="p-4 text-right">

                        <div className="flex items-center justify-end gap-2">

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

                          <button
                            onClick={() =>
                              handleDeleteProduct(
                                prod.id,
                                prod.name ||
                                  "este producto"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />

                            </svg>

                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                }
              )

            ) : (

              <tr>

                <td
                  colSpan={8}
                  className="p-8 text-center text-gray-400 italic"
                >
                  No se encontraron
                  productos.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* PAGINACIÓN */}

      {!loading &&
        filteredProducts.length >
          0 && (

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-5">

            <div className="text-sm text-gray-400">

              Mostrando{" "}

              <span className="text-white font-medium">
                {startIndex + 1}
              </span>

              {" - "}

              <span className="text-white font-medium">
                {Math.min(
                  endIndex,
                  filteredProducts.length
                )}
              </span>

              {" de "}

              <span className="text-white font-medium">
                {
                  filteredProducts.length
                }
              </span>

              {" producto"}

              {filteredProducts.length !==
              1
                ? "s"
                : ""}

            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">

              <select
                value={
                  itemsPerPage
                }
                onChange={(e) =>
                  setItemsPerPage(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              >

                <option value={5}>
                  5 por página
                </option>

                <option value={10}>
                  10 por página
                </option>

                <option value={20}>
                  20 por página
                </option>

                <option value={50}>
                  50 por página
                </option>

              </select>

              <button
                onClick={() =>
                  goToPage(
                    currentPage - 1
                  )
                }
                disabled={
                  currentPage === 1
                }
                className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-sm hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ←
              </button>

              <div className="flex items-center gap-1">

                {getPageNumbers().map(
                  (
                    page,
                    index
                  ) => {

                    if (
                      page ===
                      -1
                    ) {
                      return (
                        <span
                          key={`dots-${index}`}
                          className="px-2 text-gray-500"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        onClick={() =>
                          goToPage(
                            page
                          )
                        }
                        className={`min-w-[38px] px-3 py-2 rounded-lg text-sm transition ${
                          currentPage ===
                          page
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {
                          page
                        }
                      </button>
                    );
                  }
                )}

              </div>

              <button
                onClick={() =>
                  goToPage(
                    currentPage + 1
                  )
                }
                disabled={
                  currentPage ===
                  totalPages
                }
                className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-sm hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                →
              </button>

            </div>

          </div>
        )}

      {/* MODAL */}

      {isCreateModalOpen && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">

          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full shadow-xl border border-gray-700 max-h-[90vh] overflow-y-auto">

            <h2 className="text-xl font-bold mb-4 text-indigo-400">

              {editingProductId
                ? "Editar Producto"
                : "Crear Nuevo Producto"}

            </h2>

            <form
              onSubmit={
                handleSaveProduct
              }
              className="space-y-4"
            >

              {/* SKU */}

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
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      sku:
                        e.target
                          .value,
                    })
                  }
                  className={`w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none ${
                    !editingProductId
                      ? "cursor-not-allowed opacity-80"
                      : "focus:border-indigo-500"
                  }`}
                  required
                />

                {!editingProductId && (
                  <p className="text-xs text-gray-400 mt-1">
                    El SKU se genera
                    automáticamente y no
                    se puede modificar.
                  </p>
                )}

              </div>

              {/* NOMBRE */}

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
                      name:
                        e.target
                          .value,
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                  required
                />

              </div>

              {/* IMÁGENES */}

              <div>

                <label className="block text-sm text-gray-300 mb-1">
                  Imágenes del Producto
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  multiple
                  onChange={
                    handleImageChange
                  }
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                />

                <p className="text-xs text-gray-500 mt-1">
                  Máximo 10 imágenes,
                  JPG, JPEG, PNG o WEBP.
                  Máximo 5 MB por imagen.
                </p>

                {imagePreviews.length >
                  0 && (

                  <div className="mt-4">

                    <div className="text-xs text-gray-400 mb-2">
                      {
                        imagePreviews.length
                      }{" "}
                      imagen
                      {imagePreviews.length !==
                      1
                        ? "es"
                        : ""}{" "}
                      seleccionada
                      {imagePreviews.length !==
                      1
                        ? "s"
                        : ""}
                    </div>

                    <div className="grid grid-cols-3 gap-3">

                      {imagePreviews.map(
                        (
                          preview,
                          index
                        ) => (

                          <div
                            key={`${preview}-${index}`}
                            className="relative group"
                          >

                            <img
                              src={
                                preview
                              }
                              alt={`Imagen ${
                                index +
                                1
                              }`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-600"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveImage(
                                  index
                                )
                              }
                              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-90"
                              title="Eliminar imagen"
                            >
                              ×
                            </button>

                            <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              {
                                index +
                                1
                              }
                            </div>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                )}

              </div>

              {/* CATEGORÍA */}

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
                        e.target
                          .value,
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                  required
                >

                  <option value="">
                    -- Seleccione Categoría --
                  </option>

                  {categories.map(
                    (cat) => (
                      <option
                        key={
                          cat.id
                        }
                        value={
                          cat.id
                        }
                      >
                        {
                          cat.name
                        }
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* PROVEEDOR */}

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
                        e.target
                          .value,
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                  required
                >

                  <option value="">
                    -- Seleccione Proveedor --
                  </option>

                  {suppliers.map(
                    (sup) => (
                      <option
                        key={
                          sup.id
                        }
                        value={
                          sup.id
                        }
                      >
                        {
                          sup.name
                        }
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* STOCK MÍNIMO */}

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
                          e.target
                            .value
                        ),
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                  required
                />

              </div>

              {/* STOCK MÁXIMO */}

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
                          e.target
                            .value
                        ),
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                  required
                />

              </div>

              {/* PRECIO COMPRA */}

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
                          e.target
                            .value
                        ),
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                  required
                />

              </div>

              {/* PRECIO VENTA */}

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
                          e.target
                            .value
                        ),
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                  required
                />

              </div>

              {/* OFERTA */}

              <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/40">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <label className="block text-sm text-gray-200 font-semibold">
                      Producto en oferta
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Activa esta opción para aplicar un precio especial.
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={newProduct.isOnSale}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          isOnSale:
                            e.target.checked,
                          salePrice:
                            e.target.checked
                              ? newProduct.salePrice
                              : 0,
                        })
                      }
                    />
                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-500 peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                  </label>
                </div>

                {newProduct.isOnSale && (
                  <div className="mt-4">
                    <label className="block text-sm text-gray-300 mb-1">
                      Precio de Oferta
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={
                        newProduct.salePrice ??
                        ""
                      }
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          salePrice:
                            e.target.value ===
                            ""
                              ? 0
                              : Number(
                                  e.target.value
                                ),
                        })
                      }
                      placeholder="Ej. 80.00"
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                    />

                    <p className="text-xs text-gray-500 mt-1">
                      Debe ser menor que el precio de venta normal.
                    </p>
                  </div>
                )}
              </div>

              {/* BOTONES */}

              <div className="flex justify-end space-x-3 mt-6">

                <button
                  type="button"
                  onClick={
                    handleCloseModal
                  }
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-semibold transition"
                >
                  {editingProductId
                    ? "Actualizar Producto"
                    : "Guardar Producto"}
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