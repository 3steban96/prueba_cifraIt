import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAlert
} from '@coreui/react';
import { useRequests } from '../../hooks/useRequests';
import Select from '../../components/Select';
import TextArea from '../../components/TextArea';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { ESTADO_SOLICITUD } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';
import { getSupportRequests } from '../../services/requestsService';
import { useAuth } from '../../hooks/useAuth';

const UpdateRequest = () => {
const { id } = useParams();  // Get the request ID from URL params
const { user } = useAuth();  // Add this to get user info
const supportId = user?.user?.id || user?.id;  // Get actual support ID
  
  const navigate = useNavigate();
  
  const [request, setSolicitud] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    response: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  
  const { updateRequest, loading, error } = useRequests();

  useEffect(() => {
    loadRequests()
  }, []);
  const loadRequests = async () => {
      try {
        const data = await getSupportRequests(supportId);
        // Find the specific request we want to update
        const specificRequest = data.requests.find(req => req.id === parseInt(id));
        console.log("Request to update:", specificRequest);
        
        if (specificRequest) {
          setSolicitud(specificRequest);
          setFormData({
            id: specificRequest.id,
            status: specificRequest.status,
            response: specificRequest.response || '',
            supportId: specificRequest.support_id || supportId
          });
        }
      } catch (error) {
        console.error('Error al cargar solicitudes:', error);
      }
  }
  const estadoOptions = Object.values(ESTADO_SOLICITUD).map(e => ({
    value: e,
    label: e
  }));

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.status) {
      newErrors.status = 'El estado es obligatorio';
    }
    
    if (!formData.response.trim()) {
      newErrors.response = 'La respuesta es obligatoria';
    } else if (formData.response.trim().length < 10) {
      newErrors.response = 'La respuesta debe tener al menos 10 caracteres';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const updateData = {
        ...formData,
        update_at: new Date().toISOString()
      };

      await updateRequest(supportId, updateData);
      setSuccess('Solicitud actualizada exitosamente');
      
      setTimeout(() => {
        navigate('/support/requests');
      }, 2000);
    } catch (err) {
      console.error('Error al actualizar solicitud:', err);
    }
  };

  if (!request) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Actualizar Solicitud #{request.supportId}</strong>
          </CCardHeader>
          <CCardBody>
            {success && (
              <CAlert color="success" dismissible onClose={() => setSuccess('')}>
                {success}
              </CAlert>
            )}
            
            {error && (
              <CAlert color="danger" dismissible>
                {error}
              </CAlert>
            )}

            <div className="mb-4 p-3 bg-light rounded">
              <CRow className="mb-2">
                <CCol md={6}>
                  <strong>Cliente:</strong> {request.client_name}
                </CCol>
                <CCol md={6}>
                  <strong>Fecha:</strong> {formatDate(request.created_at)}
                </CCol>
              </CRow>
              <CRow className="mb-2">
                <CCol md={4}>
                  <strong>Categoría:</strong> {request.category}
                </CCol>
                <CCol md={4}>
                  <strong>Prioridad:</strong> <Badge text={request.priority} type="priority" />
                </CCol>
                <CCol md={4}>
                  <strong>Estado Actual:</strong> <Badge text={request.status} type="status" />
                </CCol>
              </CRow>
              <hr />
              <div className="mb-2">
                <strong>Asunto:</strong>
                <p className="mb-0">{request.title}</p>
              </div>
              <div>
                <strong>Descripción:</strong>
                <p className="mb-0">{request.description}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <Select
                label="Actualizar Estado"
                value={formData.estado}
                onChange={(e) => handleChange('status', e.target.value)}
                options={estadoOptions}
                error={errors.estado}
                required
              />

              <TextArea
                label="Respuesta"
                placeholder="Escriba su respuesta al cliente..."
                value={formData.response}
                onChange={(e) => handleChange('response', e.target.value)}
                rows={6}
                error={errors.response}
                required
              />

              <div className="d-flex gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                >
                  Guardar Cambios
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/support/requests')}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default UpdateRequest;