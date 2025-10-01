import { useCallback, useState } from 'react';
import * as requestsService from '../services/requestsService';

export const useRequests = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createRequest = useCallback(async (request) => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestsService.createRequest(request);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || 'Error al crear la solicitud');
      setLoading(false);
      throw err;
    }
  }, []);

  const getClientRequests = useCallback(async (clientId) => {
    console.log('Fetching requests for clientId:', clientId);
    setLoading(true);
    setError(null);
    try {
      const data = await requestsService.getCustomerRequests(clientId);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || 'Error al obtener solicitudes');
      setLoading(false);
      throw err;
    }
  }, []);

  const getSupportRequests = useCallback(async (supportId) => {
    console.log('Fetching requests for supportId:', supportId);
    setLoading(true);
    setError(null);
    try {
      const data = await requestsService.getSupportRequests(supportId);
      console.log("data from service:",data)
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || 'Error al obtener solicitudes');
      setLoading(false);
      throw err;
    }
  }, []);

  const updateRequest = useCallback(async (supportId, data) => {
    console.log('Updating request for supportId:', supportId, 'with data:', data);
    setLoading(true);
    setError(null);
    try {
      const result = await requestsService.updateRequest(supportId, data);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message || 'Error al actualizar solicitud');
      setLoading(false);
      throw err;
    }
  }, []);

  const getAllRequests = useCallback(async (filtros = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestsService.getAllRequests(filtros);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || 'Error al obtener solicitudes');
      setLoading(false);
      throw err;
    }
  }, []);

  const getStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestsService.getStatistics();
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || 'Error al obtener estadísticas');
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    loading,
    error,
    createRequest,
    getClientRequests,
    getSupportRequests,
    updateRequest,
    getAllRequests,
    getStatistics
  };
};