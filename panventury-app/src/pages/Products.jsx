import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  CardActions,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, AddShoppingCart as AddShoppingCartIcon } from '@mui/icons-material';
import {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  addProduct,
  updateProduct as updateProductAction,
  deleteProduct as deleteProductAction,
} from '../store/slices/productsSlice';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/api';
import { addToCart } from '../store/slices/cartSlice';

export default function Products() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const userRole = useSelector((state) => state.auth.user?.rol);
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: '',
  });

  const isAdmin = userRole === 'ROLE_ADMIN';
  const isPanadero = userRole === 'ROLE_PANADERO';
  const canManageProducts = isAdmin || isPanadero;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      dispatch(fetchProductsStart());
      const response = await getProducts();
      dispatch(fetchProductsSuccess(response.data));
    } catch (error) {
      dispatch(fetchProductsFailure(error.message));
    }
  };

  const handleOpen = (product = null) => {
    if (!canManageProducts) return;
    
    if (product) {
      setEditProduct(product);
      setFormData({
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio,
        imagen: product.imagen || '',
      });
    } else {
      setEditProduct(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        imagen: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditProduct(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      imagen: '',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canManageProducts) return;

    try {
      if (editProduct) {
        const response = await updateProduct(editProduct.id, formData);
        dispatch(updateProductAction(response.data));
      } else {
        const response = await createProduct(formData);
        dispatch(addProduct(response.data));
      }
      handleClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!canManageProducts) return;

    try {
      await deleteProduct(id);
      dispatch(deleteProductAction(id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Productos</Typography>
        {canManageProducts && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Nuevo Producto
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              {product.imagen && (
                <CardMedia
                  component="img"
                  height="140"
                  image={product.imagen}
                  alt={product.nombre}
                />
              )}
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {product.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.descripcion}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  ${product.precio}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                {canManageProducts ? (
                  <>
                    <IconButton onClick={() => handleOpen(product)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(product.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                ) : (
                  <IconButton onClick={() => handleAddToCart(product)} color="primary">
                    <AddShoppingCartIcon />
                  </IconButton>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editProduct ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              name="nombre"
              label="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              name="descripcion"
              label="Descripción"
              value={formData.descripcion}
              onChange={handleChange}
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              margin="normal"
              name="precio"
              label="Precio"
              type="number"
              value={formData.precio}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              name="imagen"
              label="URL de la imagen"
              value={formData.imagen}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editProduct ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 