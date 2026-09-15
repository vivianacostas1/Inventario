import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : 'https://inventario-zl5o.onrender.com/api',
});

// ==========================================
// AGREGAR TOKEN JWT AUTOMÁTICAMENTE
// ==========================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    console.log(
      '🔐 TOKEN ENVIADO:',
      token ? 'SÍ' : 'NO'
    );

    console.log(
      '🌐 PETICIÓN:',
      config.method?.toUpperCase(),
      config.url
    );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// MANEJAR ERRORES
// ==========================================

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(
      '❌ ERROR API:',
      error.response?.status,
      error.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export default api;