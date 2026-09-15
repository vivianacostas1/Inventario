import { useCallback, useEffect, useState } from "react";
import {
  createDeliveryZone,
  deleteDeliveryZone,
  getDeliveryZones,
  updateDeliveryZone,
  type DeliveryZone,
} from "../api/delivery-zone.service";
import DeliveryZoneMap from "../components/DeliveryZoneMap";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  isActive: true,
  priority: "0",
  zoneType: "POLYGON",
};

export default function DeliveryZonesPage() {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState(emptyForm);

  // =====================================================
  // COORDENADAS DE LA ZONA
  // =====================================================

  const [coordinates, setCoordinates] = useState<number[][]>([]);

  const loadZones = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDeliveryZones();
      setZones(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las tarifas de entrega.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadZones();
  }, []);

  // =====================================================
  // RESET
  // =====================================================

  const resetForm = () => {
    setForm(emptyForm);
    setCoordinates([]);
    setEditingId(null);
  };

  // =====================================================
  // EDITAR
  // =====================================================

  const handleEdit = (zone: DeliveryZone) => {
    setEditingId(zone.id);

    setForm({
      name: zone.name,
      description: zone.description ?? "",
      price: String(zone.price),
      isActive: zone.isActive,
      priority: String(zone.priority),
      zoneType: zone.zoneType,
    });

    // Cargar coordenadas existentes
    if (
      Array.isArray(zone.coordinates) &&
      zone.coordinates.length > 0
    ) {
      const validCoordinates = zone.coordinates.filter(
        (point): point is number[] =>
          Array.isArray(point) &&
          point.length >= 2 &&
          typeof point[0] === "number" &&
          typeof point[1] === "number"
      );

      setCoordinates(validCoordinates);
    } else {
      setCoordinates([]);
    }

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // CAMBIO DE COORDENADAS
  // =====================================================

  const handleCoordinatesChange = useCallback(
    (newCoordinates: number[][]) => {
      setCoordinates(newCoordinates);
    },
    []
  );

  // =====================================================
  // GUARDAR
  // =====================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ---------------------------------------------
    // VALIDAR NOMBRE
    // ---------------------------------------------

    if (!form.name.trim()) {
      setError("El nombre de la zona es obligatorio.");
      return;
    }

    // ---------------------------------------------
    // VALIDAR PRECIO
    // ---------------------------------------------

    const price = Number(form.price);

    if (Number.isNaN(price) || price < 0) {
      setError("El precio debe ser mayor o igual a 0.");
      return;
    }

    // ---------------------------------------------
    // VALIDAR PRIORIDAD
    // ---------------------------------------------

    const priority = Number(form.priority);

    if (Number.isNaN(priority)) {
      setError("La prioridad debe ser un número.");
      return;
    }

    // ---------------------------------------------
    // VALIDAR POLÍGONO
    // ---------------------------------------------

    if (
      form.zoneType === "POLYGON" &&
      coordinates.length < 3
    ) {
      setError(
        "Debes dibujar la zona en el mapa antes de guardar."
      );
      return;
    }

    try {
      setSaving(true);

      const data = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price,
        isActive: form.isActive,
        priority,
        zoneType: form.zoneType,

        // Para POLYGON guardamos las coordenadas.
        // Para PICKUP dejamos el campo vacío.
        coordinates:
          form.zoneType === "POLYGON"
            ? coordinates
            : null,
      };

      // ---------------------------------------------
      // ACTUALIZAR
      // ---------------------------------------------

      if (editingId) {
        await updateDeliveryZone(editingId, data);

        setSuccess(
          "Tarifa actualizada correctamente."
        );
      }

      // ---------------------------------------------
      // CREAR
      // ---------------------------------------------

      else {
        await createDeliveryZone(data);

        setSuccess(
          "Tarifa creada correctamente."
        );
      }

      resetForm();

      await loadZones();
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.details ||
          err?.response?.data?.error ||
          "No se pudo guardar la tarifa."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // ELIMINAR
  // =====================================================

  const handleDelete = async (zone: DeliveryZone) => {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar "${zone.name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteDeliveryZone(zone.id);

      if (editingId === zone.id) {
        resetForm();
      }

      setSuccess(
        "Zona eliminada correctamente."
      );

      await loadZones();
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.details ||
          err?.response?.data?.error ||
          "No se pudo eliminar la zona."
      );
    }
  };

  return (
    <div className="min-h-full bg-gray-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* =====================================================
            ENCABEZADO
        ===================================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-2xl">
                🚚
              </div>

              <div>

                <h1 className="text-3xl font-bold text-white">
                  Tarifas de entrega
                </h1>

                <p className="text-gray-400 mt-1">
                  Configura los costos de envío y zonas de cobertura.
                </p>

              </div>

            </div>
          </div>

          <div className="flex items-center gap-2">

            <div className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700">

              <span className="text-gray-400 text-xs">
                Zonas configuradas
              </span>

              <div className="text-xl font-bold text-indigo-400">
                {zones.length}
              </div>

            </div>

            <button
              type="button"
              onClick={loadZones}
              disabled={loading}
              className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white transition"
            >
              ↻ Actualizar
            </button>

          </div>

        </div>

        {/* =====================================================
            MENSAJES
        ===================================================== */}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-500/30 text-red-300 flex items-center gap-3">

            <span className="text-xl">
              ⚠️
            </span>

            <span>
              {error}
            </span>

          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-900/30 border border-emerald-500/30 text-emerald-300 flex items-center gap-3">

            <span className="text-xl">
              ✓
            </span>

            <span>
              {success}
            </span>

          </div>
        )}

        {/* =====================================================
            FORMULARIO
        ===================================================== */}

        <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden mb-8">

          <div className="px-6 py-5 border-b border-gray-700 flex items-center gap-3">

            <div className="w-9 h-9 rounded-lg bg-indigo-600/20 flex items-center justify-center">
              {editingId ? "✏️" : "＋"}
            </div>

            <div>

              <h2 className="text-lg font-semibold text-white">
                {editingId
                  ? "Editar tarifa"
                  : "Nueva tarifa de entrega"}
              </h2>

              <p className="text-sm text-gray-400">
                {editingId
                  ? "Modifica los datos de esta zona."
                  : "Agrega una nueva zona de entrega."}
              </p>

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6"
          >

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

              {/* NOMBRE */}

              <div className="lg:col-span-2">

                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre de la zona
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="Ej. Centro - Camacho / Obelisco"
                  className="w-full h-11 px-4 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                />

              </div>

              {/* PRECIO */}

              <div>

                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Precio de entrega
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    Bs.
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        price: e.target.value,
                      })
                    }
                    placeholder="0.00"
                    className="w-full h-11 pl-12 pr-4 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                  />

                </div>

              </div>

              {/* PRIORIDAD */}

              <div>

                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prioridad
                </label>

                <input
                  type="number"
                  value={form.priority}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priority: e.target.value,
                    })
                  }
                  className="w-full h-11 px-4 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                />

              </div>

              {/* TIPO */}

              <div>

                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de zona
                </label>

                <select
                  value={form.zoneType}
                  onChange={(e) => {
                    const zoneType = e.target.value;

                    setForm({
                      ...form,
                      zoneType,
                    });

                    if (zoneType === "PICKUP") {
                      setCoordinates([]);
                    }
                  }}
                  className="w-full h-11 px-4 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                >

                  <option value="POLYGON">
                    Zona geográfica
                  </option>

                  <option value="PICKUP">
                    Punto de entrega
                  </option>

                </select>

              </div>

              {/* DESCRIPCIÓN */}

              <div className="lg:col-span-3">

                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  rows={2}
                  placeholder="Describe brevemente la zona..."
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition resize-none"
                />

              </div>

              {/* ESTADO */}

              <div className="flex items-end">

                <label className="w-full h-[72px] px-4 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-between cursor-pointer">

                  <div>

                    <p className="text-sm font-medium text-gray-300">
                      Zona activa
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Disponible para entregas
                    </p>

                  </div>

                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        isActive: e.target.checked,
                      })
                    }
                    className="w-5 h-5 accent-indigo-600 cursor-pointer"
                  />

                </label>

              </div>

            </div>

            {/* =====================================================
                MAPA
            ===================================================== */}

            {form.zoneType === "POLYGON" && (
              <div className="mt-7 pt-6 border-t border-gray-700">

                <div className="mb-4">

                  <h3 className="text-lg font-semibold text-white">
                    📍 Zona geográfica
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    Dibuja sobre el mapa el área donde aplica esta tarifa.
                    Puedes editar o eliminar el polígono después.
                  </p>

                </div>

                <DeliveryZoneMap
                  coordinates={coordinates}
                  onChange={handleCoordinatesChange}
                />

                <div className="mt-3 flex items-center justify-between">

                  <p className="text-xs text-gray-500">
                    {coordinates.length >= 3
                      ? `Zona dibujada: ${coordinates.length} puntos`
                      : "Aún no has dibujado una zona."}
                  </p>

                  {coordinates.length >= 3 && (
                    <span className="text-xs text-emerald-400">
                      ✓ Zona lista para guardar
                    </span>
                  )}

                </div>

              </div>
            )}

            {/* =====================================================
                INFORMACIÓN PICKUP
            ===================================================== */}

            {form.zoneType === "PICKUP" && (
              <div className="mt-7 pt-6 border-t border-gray-700">

                <div className="p-4 rounded-xl bg-indigo-900/20 border border-indigo-500/20">

                  <div className="flex items-start gap-3">

                    <span className="text-xl">
                      🏪
                    </span>

                    <div>

                      <p className="text-sm font-semibold text-indigo-300">
                        Punto de entrega
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Esta opción no utiliza un polígono geográfico.
                        Se utilizará como punto de retiro o entrega
                        configurado por la tienda.
                      </p>

                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* =====================================================
                BOTONES
            ===================================================== */}

            <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-gray-700">

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/20"
              >

                {saving
                  ? "Guardando..."
                  : editingId
                  ? "Guardar cambios"
                  : "Crear tarifa"}

              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold transition"
                >
                  Cancelar
                </button>
              )}

            </div>

          </form>

        </div>

        {/* =====================================================
            ZONAS
        ===================================================== */}

        <div className="mb-5">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-white">
                Zonas de entrega
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Estas tarifas serán utilizadas por la tienda.
              </p>

            </div>

          </div>

        </div>

        {/* =====================================================
            CARGANDO
        ===================================================== */}

        {loading ? (

          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-12 text-center">

            <div className="text-4xl mb-4">
              🚚
            </div>

            <p className="text-gray-400">
              Cargando zonas de entrega...
            </p>

          </div>

        ) : zones.length === 0 ? (

          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-12 text-center">

            <div className="text-5xl mb-4">
              📍
            </div>

            <h3 className="text-lg font-semibold text-white">
              No hay zonas configuradas
            </h3>

            <p className="text-gray-500 mt-2">
              Crea la primera tarifa de entrega.
            </p>

          </div>

        ) : (

          /* ===================================================
             TARJETAS
             =================================================== */

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {zones.map((zone) => (

              <div
                key={zone.id}
                className="group bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:border-indigo-500/40 hover:shadow-xl hover:shadow-black/20 transition duration-200"
              >

                {/* CABECERA */}

                <div className="p-5 border-b border-gray-700">

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-start gap-3">

                      <div className="w-11 h-11 rounded-xl bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center text-xl shrink-0">
                        {zone.zoneType === "PICKUP"
                          ? "🏪"
                          : "📍"}
                      </div>

                      <div>

                        <h3 className="font-bold text-white leading-tight">
                          {zone.name}
                        </h3>

                        <span className="inline-block mt-2 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-900 text-gray-400 border border-gray-700">

                          {zone.zoneType === "PICKUP"
                            ? "Punto de entrega"
                            : "Zona geográfica"}

                        </span>

                      </div>

                    </div>

                    <span
                      className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        zone.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-gray-700 text-gray-400 border border-gray-600"
                      }`}
                    >

                      {zone.isActive
                        ? "● Activa"
                        : "● Inactiva"}

                    </span>

                  </div>

                </div>

                {/* PRECIO */}

                <div className="p-5">

                  <div className="flex items-end justify-between mb-4">

                    <div>

                      <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        Costo de entrega
                      </p>

                      <p className="text-3xl font-bold text-indigo-400 mt-1">

                        {Number(zone.price) === 0
                          ? "GRATIS"
                          : `Bs. ${Number(zone.price).toFixed(2)}`}

                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-xs text-gray-500">
                        Prioridad
                      </p>

                      <p className="text-lg font-semibold text-gray-300">
                        {zone.priority}
                      </p>

                    </div>

                  </div>

                  {/* DESCRIPCIÓN */}

                  <div className="min-h-[48px] mb-5">

                    <p className="text-sm text-gray-400 leading-relaxed">
                      {zone.description ||
                        "Sin descripción registrada."}
                    </p>

                  </div>

                  {/* ACCIONES */}

                  <div className="flex gap-2 pt-4 border-t border-gray-700">

                    <button
                      type="button"
                      onClick={() => handleEdit(zone)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-600 hover:text-white transition font-medium text-sm"
                    >
                      ✏️ Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(zone)}
                      className="px-4 py-2.5 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white transition font-medium text-sm"
                    >
                      🗑️
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}