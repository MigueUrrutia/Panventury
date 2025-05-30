import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useSelector } from 'react-redux';
import axiosInstance from '../services/axiosConfig';

function Orders({ showAll }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const userRole = useSelector((state) => state.auth.user?.rol);

  useEffect(() => {
    fetchOrders();
  }, [showAll]);

  const fetchOrders = async () => {
    try {
      const endpoint = showAll ? '/api/ordenes' : '/api/ordenes/mis-ordenes';
      const response = await axiosInstance.get(endpoint);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/api/ordenes/${orderId}/estado`, { estado: newStatus });
      console.log('Response:', response);
      await fetchOrders();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      EN_ESPERA: '#ffa726',
      EN_PREPARACION: '#29b6f6',
      ENVIADO: '#66bb6a',
      ENTREGADO: '#4caf50',
    };
    return colors[status] || '#757575';
  };

  const getStatusText = (status) => {
    const texts = {
      EN_ESPERA: 'En Espera',
      EN_PREPARACION: 'En Preparación',
      ENVIADO: 'Enviado',
      ENTREGADO: 'Entregado',
    };
    return texts[status] || status;
  };

  const hasUpdatePermission = userRole === 'ROLE_ADMIN' || userRole === 'ROLE_PANADERO';

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {showAll ? 'Todas las Órdenes' : 'Mis Órdenes'}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              {hasUpdatePermission && (
                <TableCell>Acciones</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.cliente.nombre}</TableCell>
                <TableCell>
                  {new Date(order.fecha).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      backgroundColor: getStatusColor(order.estado),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      display: 'inline-block',
                    }}
                  >
                    {getStatusText(order.estado)}
                  </Box>
                </TableCell>
                {hasUpdatePermission && (
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenDialog(order)}
                    >
                      Actualizar Estado
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Actualizar Estado de la Orden</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={selectedOrder?.estado || ''}
              label="Estado"
              onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
            >
              <MenuItem value="EN_ESPERA">En Espera</MenuItem>
              <MenuItem value="EN_PREPARACION">En Preparación</MenuItem>
              <MenuItem value="ENVIADO">Enviado</MenuItem>
              <MenuItem value="ENTREGADO">Entregado</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Orders; 