import { createSlice } from '@reduxjs/toolkit';

// Función para obtener el estado inicial
const getInitialState = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let user = null;

  try {
    if (userStr) {
      user = JSON.parse(userStr);
    }
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
    // Limpiar datos inválidos
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  console.log('Estado inicial de auth:', { token, user }); // Debug log
  return {
    isAuthenticated: !!token,
    user,
    token,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    loginSuccess: (state, action) => {
      console.log('Login payload:', action.payload); // Debug log

      const user = {
        id: action.payload.userId,
        nombre: action.payload.nombre,
        rol: action.payload.rol.startsWith('ROLE_') ? action.payload.rol : `ROLE_${action.payload.rol}`
      };

      // Asegurarnos de que tenemos un token válido
      if (!action.payload.token) {
        console.error('No se recibió token en loginSuccess');
        return;
      }

      const token = action.payload.token.startsWith('Bearer ') 
        ? action.payload.token 
        : `Bearer ${action.payload.token}`;

      state.isAuthenticated = true;
      state.user = user;
      state.token = token;
      
      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      console.log('Estado actualizado después del login:', { 
        user, 
        token,
        storedToken: localStorage.getItem('token'),
        storedUser: localStorage.getItem('user')
      });
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      // Limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('Estado limpiado después del logout');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer; 