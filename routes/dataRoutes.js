// routes/dataRoutes.js (Código Completo)

const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController'); // <--- Verifica se este controller existe!
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas de visualização são protegidas
router.use(authMiddleware.verifyToken);

// GET /api/data/customers?page=1
router.get('/customers', dataController.getCustomers);

// GET /api/data/products?page=1
router.get('/products', dataController.getProducts);

module.exports = router;