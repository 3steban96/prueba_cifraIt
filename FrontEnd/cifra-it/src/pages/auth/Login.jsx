import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CRow,
  CAlert
} from '@coreui/react';
import { useAuth } from '../../hooks/useAuth';
import { login as loginService } from '../../services/requestsService';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import { ROLES } from '../../utils/constants';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const roleOptions = [
    { value: ROLES.CLIENTE, label: 'Cliente' },
    { value: ROLES.SOPORTE, label: 'Soporte' },
    { value: ROLES.ADMIN, label: 'Administrador' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !role) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);

    try {
      // Llamar al servicio de login
      const userData = await loginService(username, password);
      
      // Agregar el rol seleccionado al usuario
      const userWithRole = { ...userData, rol: role };
      
      login(userWithRole);

      // Redirigir según el rol
      switch (role) {
        case ROLES.CLIENTE:
          navigate('/customer/requests');
          break;
        case ROLES.SOPORTE:
          navigate('/support/requests');
          break;
        case ROLES.ADMIN:
          navigate('/admin/requests');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión. Verifique sus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <form onSubmit={handleSubmit}>
                    <h1>Iniciar Sesión</h1>
                    <p className="text-medium-emphasis">Sistema de Gestión de Solicitudes</p>
                    
                    {error && (
                      <CAlert color="danger" dismissible onClose={() => setError('')}>
                        {error}
                      </CAlert>
                    )}

                    <Input
                      label="Usuario"
                      placeholder="Ingrese su usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      autoComplete="username"
                    />

                    <Input
                      label="Contraseña"
                      type="password"
                      placeholder="Ingrese su contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />

                    <Select
                      label="Rol"
                      placeholder="Seleccione su rol"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      options={roleOptions}
                      required
                    />

                    <CRow>
                      <CCol xs={12}>
                        <Button
                          variant="primary"
                          className="w-100"
                          type="submit"
                          loading={loading}
                        >
                          Iniciar Sesión
                        </Button>
                      </CCol>
                    </CRow>
                  </form>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sistema de Solicitudes</h2>
                    <p>
                      Plataforma integral para la gestión de solicitudes de clientes, 
                      soporte técnico y administración.
                    </p>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;