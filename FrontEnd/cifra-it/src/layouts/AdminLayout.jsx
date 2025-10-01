import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CNavItem,
  CContainer,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMenu, cilUser, cilAccountLogout, cilSpreadsheet, cilChart } from '@coreui/icons';
import { useAuth } from '../hooks/useAuth';

const AdminLayout = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
        <CSidebar
            className="border-end"
            unfoldable
            visible={sidebarVisible}
            onVisibleChange={(visible) => setSidebarVisible(visible)}
        >
        <CSidebarNav>
          <CNavItem>
            <Link to="/admin/requests" className="nav-link">
              <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />
              Todas las Solicitudes
            </Link>
          </CNavItem>
          <CNavItem>
            <Link to="/admin/statistics" className="nav-link">
              <CIcon icon={cilChart} customClassName="nav-icon" />
              Estadísticas
            </Link>
          </CNavItem>
        </CSidebarNav>
      </CSidebar>

      <div className="wrapper d-flex flex-column min-vh-100">
        <CHeader>
          <CHeaderToggler
            onClick={() => setSidebarVisible(!sidebarVisible)}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
          <CHeaderNav className="ms-auto">
            <CDropdown variant="nav-item">
              <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
                <CIcon icon={cilUser} size="lg" />
                <span className="ms-2">{user?.nombre || user?.username}</span>
              </CDropdownToggle>
              <CDropdownMenu className="pt-0" placement="bottom-end">
                <CDropdownItem disabled>
                  <strong>Rol: Administrador</strong>
                </CDropdownItem>
                <CDropdownDivider />
                <CDropdownItem onClick={handleLogout}>
                  <CIcon icon={cilAccountLogout} className="me-2" />
                  Cerrar Sesión
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CHeaderNav>
        </CHeader>

        <div className="body flex-grow-1 px-3">
          <CContainer lg>
            <Outlet />
          </CContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;