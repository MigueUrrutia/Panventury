import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { getMyOrders, getOrders, updateOrderStatus } from '../services/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.rol === 'ROLE_ADMIN';
  const isPanadero = user?.rol === 'ROLE_PANADERO';
  const canManageOrders = isAdmin || isPanadero;

  const fetchOrdersData = async () => {
    try {
      setLoading(true);
      const response = canManageOrders ? 
        await getOrders() : 
        await getMyOrders();
      setOrders(response.data);
    } catch (err) {
      console.error('Error al obtener las órdenes:', err);
      setError('Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, [canManageOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await fetchOrdersData();
      setOpenDialog(false);
    } catch (err) {
      console.error('Error al actualizar el estado:', err);
      setError('Error al actualizar el estado de la orden');
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

  if (loading) return <Typography>Cargando órdenes...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {canManageOrders ? 'Gestión de Órdenes' : 'Mis Órdenes'}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Detalles</TableCell>
              {canManageOrders && <TableCell>Acciones</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
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
                {canManageOrders && (
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setSelectedOrder(order);
                        setNewStatus(order.estado);
                        setOpenDialog(true);
                      }}
                    >
                      Cambiar Estado
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Cambiar Estado de la Orden</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={newStatus}
              label="Estado"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="EN_ESPERA">En Espera</MenuItem>
              <MenuItem value="EN_PREPARACION">En Preparación</MenuItem>
              <MenuItem value="ENVIADO">Enviado</MenuItem>
              <MenuItem value="ENTREGADO">Entregado</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            onClick={() => handleStatusChange(selectedOrder.id, newStatus)}
            variant="contained"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 