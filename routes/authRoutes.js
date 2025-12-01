// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota de Registro
router.post('/signup', authController.signup);

// Rota de Login (faremos no próximo passo)
// router.post('/login', authController.login); 

module.exports = router;