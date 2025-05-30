import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import axiosInstance from '../services/axiosConfig';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleUpdateQuantity = (id, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    } else {
      dispatch(removeFromCart(id));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleProceedToCheckout = async () => {
    if (items.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      // Crear la orden con el formato que espera el backend
      const orderData = {
        orden: {
          estado: "EN_ESPERA"
        },
        detalles: items.map(item => ({
          cantidad: item.quantity,
          precioUnitario: item.precio,
          producto: {
            id: item.id
          }
        }))
      };

      console.log('Enviando orden:', orderData);

      // Enviar la orden al backend
      const response = await axiosInstance.post('/api/ordenes', orderData);
      console.log('Respuesta del servidor:', response.data);
      
      // Limpiar el carrito después de crear la orden exitosamente
      dispatch(clearCart());
      setSuccess(true);
      
      // Redirigir a la página de órdenes después de un breve delay
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err) {
      console.error('Error al crear la orden:', err);
      setError(err.response?.data?.mensaje || 'Error al procesar la orden');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">El carrito está vacío</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Carrito de Compras
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="center">Cantidad</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nombre}</TableCell>
                <TableCell align="right">${item.precio}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  ${(item.precio * item.quantity).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align="right">
                <strong>Total:</strong>
              </TableCell>
              <TableCell align="right">
                <strong>${total.toFixed(2)}</strong>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={handleClearCart}
          disabled={loading}
        >
          Vaciar Carrito
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleProceedToCheckout}
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Proceder al Pago'}
        </Button>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        message="¡Orden creada exitosamente!"
      />
    </Box>
  );
} 