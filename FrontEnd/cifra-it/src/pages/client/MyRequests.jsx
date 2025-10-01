import {
    CAlert,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow
} from '@coreui/react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Table from '../../components/Table';
import { useAuth } from '../../hooks/useAuth';
import { useRequests } from '../../hooks/useRequests';
import { formatDate } from '../../utils/formatDate';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const { user } = useAuth();
  const { getClientRequests, loading, error } = useRequests();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
      loadRequests();
  }, [location]);

  const loadRequests = async () => {
    try {
      const data = await getClientRequests(user.user.id);
      setRequests(data.requests);
    } catch (err) {
      console.error('Error al cargar solicitudes:', err);
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'ID'
    },
    {
      key: 'title',
      label: 'Asunto'
    },
    {
      key: 'category', 
      label: 'Categoría'
    },
    {
      key: 'priority',
      label: 'Prioridad',
      render: (value) => <Badge text={value} type="priority" />
    },
    {
      key: 'status', 
      label: 'Estado',
      render: (value) => <Badge text={value} type="status" />
    },
    {
      key: 'created_at',
      label: 'Fecha',
      render: (value) => formatDate(value)
    }
  ];


  const handleRowClick = (request) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Mis Solicitudes ({requests.length})</strong>
            <div className="d-flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/customer/create')}
              >
                + Nueva Solicitud
              </Button>
            </div>
          </CCardHeader>
          <CCardBody>
            {error && (
              <CAlert color="danger" dismissible>
                {error}
              </CAlert>
            )}

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : (
              <Table
                columns={columns}
                data={requests}
                onRowClick={handleRowClick}
              />
            )}
          </CCardBody>
        </CCard>
      </CCol>

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Detalle de Solicitud"
        size="lg"
      >
        {selectedRequest && (
          <div>
            <CRow className="mb-3">
              <CCol md={6}>
                <strong>ID:</strong> {selectedRequest.id}
              </CCol>
              <CCol md={6}>
                <strong>Fecha:</strong> {formatDate(selectedRequest.created_at)}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={4}>
                <strong>Estado:</strong> <Badge text={selectedRequest.status} type="status" />
              </CCol>
              <CCol md={4}>
                <strong>Prioridad:</strong> <Badge text={selectedRequest.priority} type="priority" />
              </CCol>
              <CCol md={4}>
                <strong>Categoría:</strong> {selectedRequest.category}
              </CCol>
            </CRow>
            <hr />
            <div className="mb-3">
              <strong>Asunto:</strong>
              <p>{selectedRequest.title}</p>
            </div>
            <div className="mb-3">
              <strong>Descripción:</strong>
              <p>{selectedRequest.description}</p>
            </div>
            {selectedRequest.response && (
            <div className="mb-3">
                <strong>Respuesta:</strong>
                <div className="alert alert-info">
                {selectedRequest.response}
                </div>
                {selectedRequest.response_date && (
                <small className="text-muted">
                    Respondido el: {formatDate(selectedRequest.response_date)}
                </small>
                )}
            </div>
            )}
          </div>
        )}
      </Modal>
    </CRow>
  );
};

export default MyRequests;