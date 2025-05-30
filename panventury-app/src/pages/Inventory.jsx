import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import {
  fetchInventoryStart,
  fetchInventorySuccess,
  fetchInventoryFailure,
  updateInventory as updateInventoryAction,
} from '../store/slices/inventorySlice';
import { getInventory, updateInventoryQuantity } from '../services/api';
import { Navigate } from 'react-router-dom';

export default function Inventory() {
  const dispatch = useDispatch();
  const { inventory, loading, error } = useSelector((state) => state.inventory);
  const userRole = useSelector((state) => state.auth.user?.rol);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [updateError, setUpdateError] = useState(null);

  const isAdmin = userRole === 'ROLE_ADMIN';
  const isPanadero = userRole === 'ROLE_PANADERO';
  const canManageInventory = isAdmin || isPanadero;

  useEffect(() => {
    if (canManageInventory) {
      fetchInventoryData();
    }
  }, [canManageInventory]);

  // Si el usuario no tiene permisos, redirigir al inicio
  if (!canManageInventory) {
    return <Navigate to="/" replace />;
  }

  const fetchInventoryData = async () => {
    try {
      dispatch(fetchInventoryStart());
      const response = await getInventory();
      dispatch(fetchInventorySuccess(response.data));
    } catch (error) {
      dispatch(fetchInventoryFailure(error.message));
    }
  };

  const handleOpen = (item) => {
    if (!canManageInventory) return;
    setSelectedItem(item);
    setQuantity(item.cantidad.toString());
    setUpdateError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
    setQuantity('');
    setUpdateError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canManageInventory) return;

    try {
      setUpdateError(null);
      const response = await updateInventoryQuantity(
        selectedItem.producto.id,
        parseInt(quantity)
      );
      dispatch(updateInventoryAction(response.data));
      handleClose();
    } catch (error) {
      console.error('Error:', error);
      setUpdateError(error.response?.data?.mensaje || 'Error al actualizar el inventario');
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Cargando inventario...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Inventario
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell align="right">Cantidad</TableCell>
              <TableCell align="right">Precio Unitario</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.producto.nombre}</TableCell>
                <TableCell>{item.producto.descripcion}</TableCell>
                <TableCell align="right">{item.cantidad}</TableCell>
                <TableCell align="right">${item.producto.precio}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(item)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ajustar Inventario</DialogTitle>
        <DialogContent>
          {updateError && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {updateError}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Producto: {selectedItem?.producto.nombre}
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Nueva Cantidad"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 