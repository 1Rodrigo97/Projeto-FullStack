// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota de Registro
// O caminho FINAL será /api/auth + /signup
router.post('/signup', authController.signup);

// Rota de Login
// O caminho FINAL será /api/auth + /login
router.post('/login', authController.login); 

module.exports = router;