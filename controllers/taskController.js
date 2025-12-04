// controllers/taskController.js

const Task = require('../models/Task');
const { Op } = require('sequelize'); // Opcional, mas bom para futuras consultas

// 1. CRIAR TAREFA
exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.userId; // ID fornecido pelo middleware de autenticação

    if (!title) {
      return res.status(400).json({ message: 'O título é obrigatório.' });
    }

    const task = await Task.create({ title, description, userId });
    return res.status(201).json(task);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao criar tarefa.' });
  }
};

// 2. LER TODAS AS TAREFAS DO USUÁRIO
exports.getTasks = async (req, res) => {
  try {
    const userId = req.userId;
    // Busca apenas as tarefas onde o userId corresponde ao usuário autenticado
    const tasks = await Task.findAll({ 
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(tasks);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar tarefas.' });
  }
};

// 3. ATUALIZAR TAREFA
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const userId = req.userId;

    // Busca a tarefa e garante que ela pertence ao usuário autenticado
    const [updated] = await Task.update(
      { title, description, completed },
      { 
        where: { id, userId } // Condição dupla de segurança
      }
    );

    if (updated) {
      const updatedTask = await Task.findByPk(id);
      return res.status(200).json(updatedTask);
    }
    
    return res.status(404).json({ message: 'Tarefa não encontrada ou não pertence a este usuário.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar tarefa.' });
  }
};

// 4. DELETAR TAREFA
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Deleta a tarefa e garante que ela pertence ao usuário
    const deleted = await Task.destroy({
      where: { id, userId } // Condição dupla de segurança
    });

    if (deleted) {
      return res.status(204).send(); // 204 No Content: sucesso sem corpo de resposta
    }

    return res.status(404).json({ message: 'Tarefa não encontrada ou não pertence a este usuário.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao deletar tarefa.' });
  }
};