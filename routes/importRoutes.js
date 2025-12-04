// routes/importRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const importController = require('../controllers/importController');
const authMiddleware = require('../middlewares/authMiddleware');

// Configuração do Multer para salvar o arquivo temporariamente na pasta 'uploads/'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Cria a pasta 'uploads' se ela não existir
    require('fs').mkdirSync('uploads', { recursive: true });
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Protege todas as rotas de importação com o middleware de autenticação
router.use(authMiddleware.verifyToken); 

// POST /api/import/customers
router.post('/customers', upload.single('file'), importController.importData('customers'));

// POST /api/import/products
router.post('/products', upload.single('file'), importController.importData('products'));

module.exports = router;