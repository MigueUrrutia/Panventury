import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  ShoppingCart as OrdersIcon,
  Store as ProductsIcon,
} from '@mui/icons-material';
import { fetchProductsSuccess } from '../store/slices/productsSlice';
import { fetchOrdersSuccess } from '../store/slices/ordersSlice';
import { getProducts, getOrders, getMyOrders } from '../services/api';

export default function Dashboard() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const orders = useSelector((state) => state.orders.orders);
  const user = useSelector((state) => state.auth.user);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isAdmin = user?.rol === 'ROLE_ADMIN';
  const isPanadero = user?.rol === 'ROLE_PANADERO';
  const canManageOrders = isAdmin || isPanadero;

  useEffect(() => {
    fetchData();
    getRecentOrders();
  }, [canManageOrders]);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        getProducts(),
        canManageOrders ? getOrders() : getMyOrders(),
      ]);

      dispatch(fetchProductsSuccess(productsRes.data));
      dispatch(fetchOrdersSuccess(ordersRes.data));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getRecentOrders = async () => {
    try {
      setLoading(true);
      const response = canManageOrders ? 
        await getOrders() : 
        await getMyOrders();
      
      const sortedOrders = [...response.data].sort((a, b) => 
        new Date(b.fecha) - new Date(a.fecha)
      ).slice(0, 5);
      
      setRecentOrders(sortedOrders);
      setError(null);
    } catch (err) {
      console.error('Error al obtener órdenes recientes:', err);
      setError('Error al cargar las órdenes recientes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'EN_ESPERA': 'warning',
      'EN_PREPARACION': 'info',
      'ENVIADO': 'primary',
      'ENTREGADO': 'success'
    };
    return colors[status] || 'default';
  };

  if (loading) return <Typography>Cargando...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bienvenido, {user?.nombre}
      </Typography>

      <Grid container spacing={3}>
        {/* Resumen de estadísticas */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#e3f2fd',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ProductsIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Productos Disponibles</Typography>
            </Box>
            <Typography variant="h4">{products.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#fff3e0',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <OrdersIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Órdenes Totales</Typography>
            </Box>
            <Typography variant="h4">{orders.length}</Typography>
          </Paper>
        </Grid>

        {/* Órdenes recientes */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Órdenes Recientes
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Detalles</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>
                        {new Date(order.fecha).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>{order.cliente?.nombre}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.estado.replace('_', ' ')}
                          color={getStatusColor(order.estado)}
                        />
                      </TableCell>
                      <TableCell>
                        {order.detallesOrden?.map((detalle, index) => (
                          <div key={index}>
                            {detalle.producto.nombre} x {detalle.cantidad}
                          </div>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 