import {
    CAlert,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CRow
} from '@coreui/react';
import { useEffect, useState } from 'react';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import Select from '../../components/Select';
import Table from '../../components/Table';
import { useRequests } from '../../hooks/useRequests';
import { getCustomers } from '../../services/requestsService';
import { ESTADO_SOLICITUD } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

const AllRequests = () => {
  const [requests, setRequests] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtros, setFiltros] = useState({
    clientId: '',
    estado: '',
    fechaInicio: '',
    fechaFin: ''
  });
  
  const { getAllRequests, loading, error } = useRequests();

  useEffect(() => {
    loadClientes();
    loadRequests();
  }, []);

  const loadClientes = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data.customers);
    } catch (err) {
      console.error('Error al cargar clientes:', err);
    }
  };

  const loadRequests = async (filtrosActuales = filtros) => {
    try {
      const filtrosLimpios = Object.fromEntries(
        Object.entries(filtrosActuales).filter(([_, v]) => v !== '')
      );
      const data = await getAllRequests(filtrosLimpios);
      setRequests(data.requests);
    } catch (err) {
      console.error('Error al cargar solicitudes:', err);
    }
  };

  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    loadRequests(filtros);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      clientId: '',
      estado: '',
      fechaInicio: '',
      fechaFin: ''
    };
    setFiltros(emptyFilters);
    loadRequests(emptyFilters);
  };

  const clienteOptions = customers.map(c => ({
    value: c.id,
    label: c.full_name
  }));

  const estadoOptions = Object.values(ESTADO_SOLICITUD).map(e => ({
    value: e,
    label: e
  }));

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
    console.log("selectedRequest",request);
    setModalVisible(true);
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Filtros</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow>
                <CCol md={3}>
                  <Select
                    label="Cliente"
                    placeholder="Todos los clientes"
                    value={filtros.clientId}
                    onChange={(e) => handleFilterChange('clientId', e.target.value)}
                    options={clienteOptions}
                  />
                </CCol>
                <CCol md={3}>
                  <Select
                    label="Estado"
                    placeholder="Todos los estados"
                    value={filtros.estado}
                    onChange={(e) => handleFilterChange('estado', e.target.value)}
                    options={estadoOptions}
                  />
                </CCol>
                <CCol md={3}>
                  <Input
                    label="Fecha Inicio"
                    type="date"
                    value={filtros.fechaInicio}
                    onChange={(e) => handleFilterChange('fechaInicio', e.target.value)}
                  />
                </CCol>
                <CCol md={3}>
                  <Input
                    label="Fecha Fin"
                    type="date"
                    value={filtros.fechaFin}
                    onChange={(e) => handleFilterChange('fechaFin', e.target.value)}
                  />
                </CCol>
              </CRow>
              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  onClick={handleApplyFilters}
                >
                  Aplicar Filtros
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleClearFilters}
                >
                  Limpiar Filtros
                </Button>
              </div>
            </CForm>
          </CCardBody>
        </CCard>

        <CCard className="mb-4">
          <CCardHeader>
            <strong>Todas las Solicitudes</strong>
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
                <strong>Cliente:</strong> {selectedRequest.client_name}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <strong>Fecha:</strong> {formatDate(selectedRequest.fechaCreacion)}
              </CCol>
              <CCol md={6}>
                <strong>Asignado a:</strong> Soporte {selectedRequest.support_id || 'Sin asignar'}
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
                {selectedRequest.updated_at && (
                  <small className="text-muted">
                    Respondido el: {formatDate(selectedRequest.updated_at)}
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

export default AllRequests;