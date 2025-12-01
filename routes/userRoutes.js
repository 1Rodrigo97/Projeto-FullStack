// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware.verifyToken, (req, res) => {
  res.json({
    message: 'Bem-vindo ao seu perfil! Você está autenticado.',
    userId: req.userId,
    userEmail: req.userEmail,
    data: new Date().toISOString()
  });
});

module.exports = router;