import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // Asegúrate que esta URL coincida con tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token encontrado:', token); // Debug log

    if (token) {
      // Asegurarnos de que el token se envía con el prefijo Bearer
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      console.log('Authorization header:', config.headers.Authorization); // Debug log
    } else {
      console.log('No se encontró token en localStorage'); // Debug log
    }

    // Log completo de la configuración de la petición
    console.log('Request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });

    return config;
  },
  (error) => {
    console.error('Error en el interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error('Error de autorización:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        config: error.config
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 