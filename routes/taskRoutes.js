// routes/taskRoutes.js

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

// Aplica o middleware de autenticação a TODAS as rotas deste roteador
router.use(authMiddleware.verifyToken);

// POST /api/tasks (Criar nova tarefa)
router.post('/', taskController.createTask);

// GET /api/tasks (Listar todas as tarefas do usuário)
router.get('/', taskController.getTasks);

// PUT /api/tasks/:id (Atualizar uma tarefa específica)
router.put('/:id', taskController.updateTask);

// DELETE /api/tasks/:id (Deletar uma tarefa específica)
router.delete('/:id', taskController.deleteTask);

module.exports = router;