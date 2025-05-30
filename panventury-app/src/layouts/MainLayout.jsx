import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as OrdersIcon,
  Store as ProductsIcon,
  Logout as LogoutIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { logout } from '../store/slices/authSlice';

const drawerWidth = 240;

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Products', icon: <ProductsIcon />, path: '/products' },
    { text: 'Orders', icon: <OrdersIcon />, path: '/orders' },
  ];

  // Solo mostrar Inventario para ADMIN y PANADERO
  if (user?.rol === 'ROLE_ADMIN' || user?.rol === 'ROLE_PANADERO') {
    menuItems.push({ text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' });
  }

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Panventury
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {user?.nombre || 'Usuario'}
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => navigate('/cart')}
            sx={{ mr: 2 }}
          >
            <Badge badgeContent={cartItemCount} color="error">
              <CartIcon />
            </Badge>
          </IconButton>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
} 