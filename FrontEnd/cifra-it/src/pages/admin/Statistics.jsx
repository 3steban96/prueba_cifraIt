import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAlert,
  CWidgetStatsA
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilFile,
  cilCheckCircle,
  cilClock,
  cilWarning
} from '@coreui/icons';
import { useRequests } from '../../hooks/useRequests';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const { getStatistics, loading, error } = useRequests();

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const data = await getStatistics();
      console.log("data stats",data);
      setStats(data.stats);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <CAlert color="danger">
        {error}
      </CAlert>
    );
  }

  return (
    <>
      <CRow>
        <CCol sm={6} lg={2}>
          <CWidgetStatsA
            className="mb-4"
            color="primary"
            value={stats?.total || 0}
            title="Total Solicitudes"
          >
            <CIcon icon={cilFile} height={36} />
          </CWidgetStatsA>
        </CCol>
        <CCol sm={6} lg={2}>
          <CWidgetStatsA
            className="mb-4"
            color="warning"
            value={stats?.pending || 0}
            title="Pendientes"
          >
            <CIcon icon={cilClock} height={36} />
          </CWidgetStatsA>
        </CCol>
        <CCol sm={6} lg={2}>
          <CWidgetStatsA
            className="mb-4"
            color="info"
            value={stats?.in_progress || 0}
            title="En Proceso"
          >
            <CIcon icon={cilWarning} height={36} />
          </CWidgetStatsA>
        </CCol>
        <CCol sm={6} lg={2}>
          <CWidgetStatsA
            className="mb-4"
            color="success"
            value={stats?.resolved || 0}
            title="Resueltas"
          >
            <CIcon icon={cilCheckCircle} height={36} />
          </CWidgetStatsA>
        </CCol>
        <CCol sm={6} lg={2}>
          <CWidgetStatsA
            className="mb-4"
            color="danger"
            value={stats?.closes || 0}
            title="Cerradas"
          >
            <CIcon icon={cilClock} height={36} />
          </CWidgetStatsA>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Solicitudes por Estado</strong>
            </CCardHeader>
            <CCardBody>
              {stats?.porEstado && (
                <div>
                  {Object.entries(stats.porEstado).map(([status, amount]) => (
                    <div key={status} className="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                      <span className="fw-semibold">{status}</span>
                      <span className="badge bg-primary">{amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Solicitudes por Prioridad</strong>
            </CCardHeader>
            <CCardBody>
              {stats?.porPrioridad && (
                <div>
                  {Object.entries(stats.porPrioridad).map(([priority, amount]) => (
                    <div key={priority} className="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                      <span className="fw-semibold">{priority}</span>
                      <span className="badge bg-secondary">{amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Solicitudes por Categoría</strong>
            </CCardHeader>
            <CCardBody>
              {stats?.porCategoria && (
                <CRow>
                  {Object.entries(stats.porCategoria).map(([category, amount]) => (
                    <CCol key={category} xs={6} md={4} lg={2} className="mb-3">
                      <div className="text-center p-3 border rounded">
                        <div className="h5 mb-0">{amount}</div>
                        <small className="text-muted">{category}</small>
                      </div>
                    </CCol>
                  ))}
                </CRow>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Métricas Adicionales</strong>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md={4} className="mb-3">
                  <div className="border-start border-start-4 border-start-info py-1 px-3">
                    <div className="text-medium-emphasis small">Tiempo Promedio de Respuesta</div>
                    <div className="fs-5 fw-semibold">{stats?.averageResponseTime || '0'} horas</div>
                  </div>
                </CCol>
                <CCol md={4} className="mb-3">
                  <div className="border-start border-start-4 border-start-warning py-1 px-3">
                    <div className="text-medium-emphasis small">Solicitudes Críticas</div>
                    <div className="fs-5 fw-semibold">{stats?.requestsReviews || 0}</div>
                  </div>
                </CCol>
                <CCol md={4} className="mb-3">
                  <div className="border-start border-start-4 border-start-success py-1 px-3">
                    <div className="text-medium-emphasis small">Tasa de Resolución</div>
                    <div className="fs-5 fw-semibold">{stats?.rateResolution || '0'}%</div>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Statistics;