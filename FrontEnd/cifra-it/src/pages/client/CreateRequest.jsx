import {
    CAlert,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow
} from '@coreui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import TextArea from '../../components/TextArea';
import { useAuth } from '../../hooks/useAuth';
import { useRequests } from '../../hooks/useRequests';
import { CATEGORIA, PRIORIDAD } from '../../utils/constants';

const CreateRequest = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    category: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  
  const { user } = useAuth();
  const { createRequest, loading, error } = useRequests();
  const navigate = useNavigate();

  const priorityOptions = Object.values(PRIORIDAD).map(p => ({
    value: p,
    label: p
  }));

  const categoryOptions = Object.values(CATEGORIA).map(c => ({
    value: c,
    label: c
  }));

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'El asunto es obligatorio';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    }
    
    if (!formData.priority) {
      newErrors.priority= 'La prioridad es obligatoria';
    }
    
    if (!formData.category) {
      newErrors.category = 'La categoría es obligatoria';
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
        const request = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            priority: formData.priority,
            clientId: user.user.id  // Access nested user object
        };
        
        await createRequest(request);
        setSuccess('Solicitud creada exitosamente');
        
        // Reset form
        setFormData({
            title: '',
            description: '',
            priority: '',
            category: ''
        });

        // Redirect after 2 seconds
        setTimeout(() => {
            navigate('/customer/requests');
        }, 2000);
    } catch (err) {
        console.error('Error al crear solicitud:', err);
    }
};
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Nueva Solicitud</strong>
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

            <form onSubmit={handleSubmit}>
              <CRow>
                <CCol md={6}>
                  <Input
                    label="Asunto"
                    placeholder="Ingrese el asunto de la solicitud"
                    value={formData.title}
                    onChange={(e) => handleChange('asunto', e.target.value)}
                    error={errors.asunto}
                    required
                  />
                </CCol>
                <CCol md={3}>
                  <Select
                    label="Prioridad"
                    value={formData.priority}
                    onChange={(e) => handleChange('prioridad', e.target.value)}
                    options={priorityOptions}
                    error={errors.prioridad}
                    required
                  />
                </CCol>
                <CCol md={3}>
                  <Select
                    label="Categoría"
                    value={formData.category}
                    onChange={(e) => handleChange('categoria', e.target.value)}
                    options={categoryOptions}
                    error={errors.category}
                    required
                  />
                </CCol>
              </CRow>

              <TextArea
                label="Descripción"
                placeholder="Describa detalladamente su solicitud..."
                value={formData.description}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                rows={6}
                error={errors.description}
                required
              />

              <div className="d-flex gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                >
                  Crear Solicitud
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/customer/requests')}
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

export default CreateRequest;