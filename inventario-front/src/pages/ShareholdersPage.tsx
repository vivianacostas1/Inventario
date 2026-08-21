import React, { useState, useEffect, Fragment } from 'react';
import api from '../api/axios';

export function ShareholdersPage() {
  const [shareholders, setShareholders] = useState<any[]>([]);
  const [expandedShareholderId, setExpandedShareholderId] = useState<string | null>(null);
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
      setShareholders(res.data);
    } catch (error) {
      console.error("Error al cargar accionistas", error);
    }
  };

  useEffect(() => {
    fetchShareholders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/shareholders', formData);
      alert('¡Accionista creado con éxito!');
      setFormData({ name: '', email: '', phone: '', sharePercentage: 0, investmentAmount: 0 });
      fetchShareholders();
    } catch (error: any) {
      console.error("Error al crear", error);
      alert(error.response?.data?.error || 'No se pudo crear el accionista');
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
            onChange={(e) => setFormData({...formData, sharePercentage: parseFloat(e.target.value)})} 
            required 
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Monto de Inversión</label>
          <input 
            type="number" 
            step="0.01" 
            value={formData.investmentAmount} 
            onChange={(e) => setFormData({...formData, investmentAmount: parseFloat(e.target.value)})} 
            required 
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-semibold transition">
            Guardar Accionista
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
              <th className="p-3">% Participación</th>
              <th className="p-3">Inversión</th>
              <th className="p-3 text-center">Productos Asignados</th>
            </tr>
          </thead>
          <tbody>
            {shareholders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-400">No hay accionistas registrados.</td>
              </tr>
            ) : (
              shareholders.map((sh: any) => {
                // Calcular resumen para la fila principal
                const productSummary: { [key: string]: number } = {};
                let totalUnits = 0;

                sh.purchases?.forEach((purchase: any) => {
                  purchase.items?.forEach((item: any) => {
                    const productName = item.product?.name || 'Producto sin nombre';
                    productSummary[productName] = (productSummary[productName] || 0) + (item.quantity || 0);
                    totalUnits += (item.quantity || 0);
                  });
                });

                const uniqueProductsCount = Object.keys(productSummary).length;

                return (
                  <Fragment key={sh.id}>
                    <tr className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="p-3">{sh.name}</td>
                      <td className="p-3">{sh.email || 'N/A'}</td>
                      <td className="p-3">{sh.phone || 'N/A'}</td>
                      <td className="p-3 font-semibold text-indigo-300">{sh.sharePercentage}%</td>
                      <td className="p-3">${sh.investmentAmount}</td>
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
                    </tr>

                    {/* Fila desplegable con Scroll interno para manejar listas largas de productos */}
                    {expandedShareholderId === sh.id && (
                      <tr className="bg-gray-900/80 border-b border-gray-700">
                        <td colSpan={6} className="p-4">
                          <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                            <h4 className="text-sm font-bold text-indigo-400 mb-3 uppercase tracking-wide flex justify-between">
                              <span>Detalle de Productos de {sh.name}</span>
                              <span className="text-emerald-400">Total Unidades: {totalUnits}</span>
                            </h4>
                            
                            {uniqueProductsCount > 0 ? (
                              <div className="max-h-60 overflow-y-auto pr-2 space-y-1">
                                {Object.entries(productSummary).map(([prodName, qty], idx) => (
                                  <div key={idx} className="flex justify-between items-center text-sm px-3 py-2 bg-gray-800 rounded border border-gray-700/60">
                                    <span className="text-gray-200">{prodName}</span>
                                    <span className="font-bold text-emerald-400">{qty} unidades</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-400 italic">Este accionista aún no tiene productos asociados.</p>
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