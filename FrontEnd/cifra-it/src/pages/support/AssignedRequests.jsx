import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAlert
} from '@coreui/react';
import { useAuth } from '../../hooks/useAuth';
import { useRequests } from '../../hooks/useRequests';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { formatDate } from '../../utils/formatDate';

const AssignedRequests = () => {
  const [requests, setRequests] = useState([]);
  
  const { user } = useAuth();
  const { getSupportRequests, loading, error } = useRequests();
  const navigate = useNavigate();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const supportId = user?.user?.id || user?.id;
      console.log('Support ID:', supportId);
      
      const data = await getSupportRequests(supportId);
      console.log("Requests recibidas:", data.requests);
      
      // Filtrar SOLO las asignadas a este soporte específico
      const filteredRequests = data.requests.filter(req => 
        req.support_id === parseInt(supportId)
      );
      
      console.log("Requests filtradas:", filteredRequests);
      setRequests(filteredRequests);
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
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (value, row) => (
        <Button
          variant="primary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/support/update/${row.id}`);
            console.log("Navigating to update request ID:", row.id);
          }}
        >
          Atender
        </Button>
      )
    }
  ];

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Solicitudes Asignadas</strong>
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
              <>
                {requests.length === 0 ? (
                  <CAlert color="info">
                    No tienes solicitudes asignadas en este momento.
                  </CAlert>
                ) : (
                  <Table
                    columns={columns}
                    data={requests}
                  />
                )}
              </>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default AssignedRequests;