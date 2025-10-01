import React from 'react';
import { CBadge } from '@coreui/react';
import { ESTADO_SOLICITUD, PRIORIDAD } from '../utils/constants';

const getStatusColor = (status) => {
  switch (status) {
    case ESTADO_SOLICITUD.PENDIENTE:
      return 'warning';
    case ESTADO_SOLICITUD.EN_PROCESO:
      return 'info';
    case ESTADO_SOLICITUD.RESUELTA:
      return 'success';
    case ESTADO_SOLICITUD.CERRADA:
      return 'secondary';
    default:
      return 'primary';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case PRIORIDAD.BAJA:
      return 'success';
    case PRIORIDAD.MEDIA:
      return 'warning';
    case PRIORIDAD.ALTA:
      return 'danger';
    case PRIORIDAD.CRITICA:
      return 'dark';
    default:
      return 'secondary';
  }
};

const Badge = ({ text, type = 'status', color }) => {
  let badgeColor = color;
  
  if (!badgeColor) {
    badgeColor = type === 'status' ? getStatusColor(text) : getPriorityColor(text);
  }

  return (
    <CBadge color={badgeColor}>
      {text}
    </CBadge>
  );
};

export default Badge;