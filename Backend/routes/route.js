const express = require('express');
const router = express.Router();
const {
    login,
    createRequest,
    getCustomerRequests,
    getSupportRequests,
    updateRequest,
    getAllRequests,
    getStatistics,
    getCustomers
} = require('../controllers/controller');

// Auth
router.post('/login', login);

// customer
router.post('/requests', createRequest);
router.get('/requests/customer/:client_id', getCustomerRequests);

// Soporte
router.get('/requests/support/:supportId', getSupportRequests);
router.put('/requests/:id', updateRequest);

// Admin
router.get('/requests', getAllRequests);
router.get('/statistics', getStatistics);
router.get('/customers', getCustomers);

module.exports = router;