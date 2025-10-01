import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';

// Layouts
import ClientLayout from '../layouts/ClientLayout';
import SupportLayout from '../layouts/SupportLayout';
import AdminLayout from '../layouts/AdminLayout';

// Auth Pages
import Login from '../pages/auth/Login';

// Client Pages
import CreateRequest from '../pages/client/CreateRequest';
import MyRequests from '../pages/client/MyRequests';

// Support Pages
import AssignedRequests from '../pages/support/AssignedRequests';
import UpdateRequest from '../pages/support/UpdateRequest';

// Admin Pages
import AllRequests from '../pages/admin/AllRequests';
import Statistics from '../pages/admin/Statistics';

// Componente para rutas protegidas
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const AppRouter = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route 
          path="/login" 
          element={user ? <Navigate to={getDefaultRoute(user.rol)} replace /> : <Login />} 
        />

        {/* Rutas de Cliente */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CLIENTE]}>
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          <Route path="create" element={<CreateRequest />} />
          <Route path="requests" element={<MyRequests />} />
          <Route index element={<Navigate to="requests" replace />} />
        </Route>

        {/* Rutas de Soporte */}
        <Route
          path="/support"
          element={
            <ProtectedRoute allowedRoles={[ROLES.SOPORTE]}>
              <SupportLayout />
            </ProtectedRoute>
          }
        >
          <Route path="requests" element={<AssignedRequests />} />
          <Route path="update/:id" element={<UpdateRequest />} />
          <Route index element={<Navigate to="requests" replace />} />
        </Route>

        {/* Rutas de Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="requests" element={<AllRequests />} />
          <Route path="statistics" element={<Statistics />} />
          <Route index element={<Navigate to="requests" replace />} />
        </Route>

        {/* Ruta raíz - redirige según el rol */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={getDefaultRoute(user.rol)} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Ruta para no autorizado */}
        <Route
          path="/unauthorized"
          element={
            <div className="d-flex justify-content-center align-items-center min-vh-100">
              <div className="text-center">
                <h1>403</h1>
                <p>No tiene permisos para acceder a esta página</p>
                <a href="/login">Volver al inicio</a>
              </div>
            </div>
          }
        />

        {/* Ruta 404 */}
        <Route
          path="*"
          element={
            <div className="d-flex justify-content-center align-items-center min-vh-100">
              <div className="text-center">
                <h1>404</h1>
                <p>Página no encontrada</p>
                <a href="/">Volver al inicio</a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

// Función auxiliar para obtener la ruta por defecto según el rol
const getDefaultRoute = (rol) => {
  switch (rol) {
    case ROLES.CLIENTE:
      return '/customer/requests';
    case ROLES.SOPORTE:
      return '/support/requests';
    case ROLES.ADMIN:
      return '/admin/requests';
    default:
      return '/login';
  }
};

export default AppRouter;