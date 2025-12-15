import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// Páginas del Dashboard
import Dashboard     from '../pages/Dashboard';
import Products      from '../pages/Products';
import Category      from '../categories/Main';
import Subcategory   from '../subcategories/Main';
import Usuarios      from '../usuarios/Main';
import Brands        from '../brands/Main';
import Atributos     from  '../atributos/Main';
import AtributosValores from '../atributosValores/Main';

import Orders     from '../pages/Orders';
import Offers     from '../pages/Offers';
import Reports    from '../pages/Reports';
import Invoices   from '../pages/Invoices';
import Settings   from '../pages/Settings';
import AgentsSettings from '../agentes/AgentsSettings';


// Componente de ruta protegida
const ProtectedRoute = ({ children }) => {
  // Aquí implementarías tu lógica de autenticación
  const { isLogin } = useSelector((state) => state.authStore || {});

  if (!isLogin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta principal del dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/usuarios"
        element={
          <ProtectedRoute>
            <Usuarios />
          </ProtectedRoute>
        }
      />

      {/* Productos */}
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />

      {/* Categorías */}
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <Category />
          </ProtectedRoute>
        }
      />

      {/* Subcategorías */}
      <Route
        path="/subcategories"
        element={
          <ProtectedRoute>
            <Subcategory />
          </ProtectedRoute>
        }
      />
      
      {/* Brands */}
      <Route
        path="/brands"
        element={
          <ProtectedRoute>
            <Brands />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/atributos"
        element={
          <ProtectedRoute>
            <Atributos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/atributos-valores"
        element={
          <ProtectedRoute>
            <AtributosValores />
          </ProtectedRoute>
        }
      />

      

      {/* Pedidos */}
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />

      {/* Clientes 
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        }
      />*/}

      {/* Ofertas */}
      <Route
        path="/offers"
        element={
          <ProtectedRoute>
            <Offers />
          </ProtectedRoute>
        }
      />

      {/* Reportes */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* Facturas */}
      <Route
        path="/invoices"
        element={
          <ProtectedRoute>
            <Invoices />
          </ProtectedRoute>
        }
      />

      {/* Configuración */}
      <Route
        path="/agents"
        element={
          <ProtectedRoute>
            <AgentsSettings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;