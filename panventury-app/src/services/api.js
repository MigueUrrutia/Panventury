import axios from 'axios';
import axiosInstance from './axiosConfig';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const login = (credentials) => axiosInstance.post('/api/auth/login', credentials);
export const register = (userData) => axiosInstance.post('/api/auth/register', userData);

// Products services
export const getProducts = () => {
  return axiosInstance.get('/api/productos');
};

export const createProduct = (productData) => {
  return axiosInstance.post('/api/productos', productData);
};

export const updateProduct = (id, productData) => {
  return axiosInstance.put(`/api/productos/${id}`, productData);
};

export const deleteProduct = (id) => {
  return axiosInstance.delete(`/api/productos/${id}`);
};

// Orders services
export const getOrders = () => {
  return axiosInstance.get('/api/ordenes');
};

export const getMyOrders = () => {
  return axiosInstance.get('/api/ordenes/mis-ordenes');
};

export const createOrder = (orderData) => {
  return axiosInstance.post('/api/ordenes', orderData);
};

export const updateOrderStatus = (id, status) => {
  return axiosInstance.put(`/api/ordenes/${id}/estado`, { estado: status });
};

// Inventory services
export const getInventory = () => {
  return axiosInstance.get('/api/inventario');
};

export const updateInventoryQuantity = (productId, quantity) => {
  return axiosInstance.put(`/api/inventario/ajustar/${productId}`, { cantidad: quantity });
};

export default api; 