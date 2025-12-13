import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Componentes
import Login from './Login';
import Layout from './Layout';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider as ThemeProviderSetting  } from './context/ThemeContext'; // ⭐ IMPORTANTE

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#8b9cf7',
      dark: '#5568d3',
    },
    secondary: {
      main: '#764ba2',
      light: '#9368bd',
      dark: '#653f8e',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  return (
    <ThemeProviderSetting>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Ruta de Login */}
          <Route path="/" element={<Login />} />
          
          {/* Rutas del Dashboard con Layout */}
          <Route
            path="/*"
            element={
              <Layout>
                <AppRoutes />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProviderSetting>
  );
}

export default App;