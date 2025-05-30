import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { store } from './store';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Dashboard from './pages/Dashboard';
import Cart from './components/Cart';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4a90e2',
    },
    secondary: {
      main: '#f5a623',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="cart" element={<Cart />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
