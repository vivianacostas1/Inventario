import React, { useState, useEffect, Fragment } from 'react';
import api from '../api/axios';

export function ShareholdersPage() {
  const [shareholders, setShareholders] = useState<any[]>([]);
  const [expandedShareholderId, setExpandedShareholderId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sharePercentage: 0,
    investmentAmount: 0,
  });

  const fetchShareholders = async () => {
    try {
      const res = await api.get('/shareholders');
      setShareholders(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al cargar accionistas", error);
      setShareholders([]);
    }
  };

  useEffect(() => {
    fetchShareholders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/shareholders/${editingId}`, formData);
        alert('¡Accionista actualizado con éxito!');
      } else {
        await api.post('/shareholders', formData);
        alert('¡Accionista creado con éxito!');
      }
      
      setFormData({ name: '', email: '', phone: '', sharePercentage: 0, investmentAmount: 0 });
      setEditingId(null);
      fetchShareholders();
    } catch (error: any) {
      console.error("Error al guardar", error);
      alert(error.response?.data?.error || 'No se pudo guardar el accionista');
    }
  };

  const handleEdit = (sh: any) => {
    setEditingId(sh.id);
    setFormData({
      name: sh.name || '',
      email: sh.email || '',
      phone: sh.phone || '',
      sharePercentage: Number(sh.sharePercentage) || 0,
      investmentAmount: Number(sh.investmentAmount) || 0,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '', sharePercentage: 0, investmentAmount: 0 });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este accionista?')) return;
    try {
      await api.delete(`/shareholders/${id}`);
      alert('Accionista eliminado con éxito');
      fetchShareholders();
    } catch (error: any) {
      console.error("Error al eliminar", error);
      alert(error.response?.data?.error || 'No se pudo eliminar el accionista');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedShareholderId(expandedShareholderId === id ? null : id);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-indigo-400">Gestión de Accionistas</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-200">
            {editingId ? '✏️ Editando Accionista' : '➕ Registrar Nuevo Accionista'}
          </h2>
          {editingId && (
            <button 
              type="button" 
              onClick={handleCancelEdit}
              className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-gray-300 transition"
            >
              Cancelar Edición
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Nombre Completo</label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Correo Electrónico</label>
          <input 
            type="email" 
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Teléfono</label>
          <input 
            type="text" 
            value={formData.phone} 
            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">% de Participación</label>
          <input 
            type="number" 
            step="0.01" 
            value={formData.sharePercentage} 
            onChange={(e) => setFormData({...formData, sharePercentage: parseFloat(e.target.value) || 0})} 
            required 
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Capital / Inversión Inicial</label>
          <input 
            type="number" 
            step="0.01" 
            value={formData.investmentAmount} 
            onChange={(e) => setFormData({...formData, investmentAmount: parseFloat(e.target.value) || 0})} 
            required 
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="md:col-span-2 flex justify-end gap-2">
          <button type="submit" className={`${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-6 py-2 rounded font-semibold transition`}>
            {editingId ? 'Actualizar Accionista' : 'Guardar Accionista'}
          </button>
        </div>
      </form>

      {/* Tabla */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-white">Lista de Accionistas</h2>
        <table className="w-full text-left text-white border-collapse">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-sm">
              <th className="p-3">Nombre</th>
              <th className="p-3">Correo</th>
              <th className="p-3">Teléfono</th>
              <th className="p-3">% Part.</th>
              <th className="p-3">Inversión Compra Productos</th>
              <th className="p-3 text-center">Productos Asignados Restantes</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(!shareholders || shareholders.length === 0) ? (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-400">No hay accionistas registrados.</td>
              </tr>
            ) : (
              shareholders.map((sh: any) => {
                const productSummary: { [key: string]: { qty: number; cost: number } } = {};
                let totalUnits = 0;
                let totalPurchaseInvestment = 0;

                const itemsList = sh.purchases || sh.compras || sh.products || [];
                itemsList.forEach((entry: any) => {
                  const items = entry.items || entry.productos || [entry];
                  items.forEach((item: any) => {
                    const productName = item.product?.name || item.nombre || item.name || 'Producto sin nombre';
                    const qty = Number(item.quantity) || Number(item.qty) || Number(item.stock) || Number(item.cantidad) || 0;
                    const price = Number(item.price) || Number(item.cost) || Number(item.unitPrice) || Number(item.precio) || Number(item.precio_costo) || Number(item.costo) || Number(item.product?.precio_costo) || Number(item.product?.price) || 0;

                    if (!productSummary[productName]) {
                      productSummary[productName] = { qty: 0, cost: 0 };
                    }
                    productSummary[productName].qty += qty;
                    productSummary[productName].cost += (qty * price);

                    totalUnits += qty;
                    totalPurchaseInvestment += (qty * price);
                  });
                });

                // Si no hay compras asociadas o da 0, usamos la inversión base del accionista
                const finalInvestment = totalPurchaseInvestment > 0 
                  ? totalPurchaseInvestment 
                  : (Number(sh.investmentAmount) || Number(sh.capital) || 0);

                const uniqueProductsCount = Object.keys(productSummary).length;

                return (
                  <Fragment key={sh.id || Math.random()}>
                    <tr className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="p-3">{sh.name || 'Sin nombre'}</td>
                      <td className="p-3">{sh.email || 'N/A'}</td>
                      <td className="p-3">{sh.phone || 'N/A'}</td>
                      <td className="p-3 font-semibold text-indigo-300">{sh.sharePercentage || 0}%</td>
                      <td className="p-3 font-bold text-emerald-400">${finalInvestment.toFixed(2)}</td>
                      <td className="p-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs text-gray-300">
                            {uniqueProductsCount} productos ({totalUnits} u.)
                          </span>
                          <button 
                            onClick={() => toggleExpand(sh.id)}
                            className="bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 px-3 py-1 rounded text-xs transition border border-indigo-500/40"
                          >
                            {expandedShareholderId === sh.id ? 'Ocultar Detalle' : 'Ver Detalle'}
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleEdit(sh)}
                            className="bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 px-2.5 py-1 rounded text-xs transition border border-amber-500/40"
                            title="Editar"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDelete(sh.id)}
                            className="bg-red-600/30 hover:bg-red-600/50 text-red-300 px-2.5 py-1 rounded text-xs transition border border-red-500/40"
                            title="Eliminar"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expandedShareholderId === sh.id && (
                      <tr className="bg-gray-900/80 border-b border-gray-700">
                        <td colSpan={7} className="p-4">
                          <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                            <h4 className="text-sm font-bold text-indigo-400 mb-3 uppercase tracking-wide flex justify-between">
                              <span>Detalle de Productos de {sh.name}</span>
                              <span className="text-emerald-400">Inversión Total: ${finalInvestment.toFixed(2)} ({totalUnits} Unidades)</span>
                            </h4>
                            
                            {uniqueProductsCount > 0 ? (
                              <div className="max-h-60 overflow-y-auto pr-2 space-y-1">
                                {Object.entries(productSummary).map(([prodName, data]: [string, any], idx) => (
                                  <div key={idx} className="flex justify-between items-center text-sm px-3 py-2 bg-gray-800 rounded border border-gray-700/60">
                                    <span className="text-gray-200">{prodName}</span>
                                    <span className="text-emerald-400 font-semibold">{data.qty} unidades — <span className="font-bold">${data.cost.toFixed(2)}</span></span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-400 italic">Este accionista aún no tiene productos asociados, mostrando inversión base.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}