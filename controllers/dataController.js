// controllers/dataController.js

const Customer = require('../models/Customer');
const Product = require('../models/Product');

/**
 * Função utilitária para buscar dados com Paginação
 */
const getPaginatedData = async (model, page, pageSize) => {
    // Define o limite de itens por página (Ex: 20)
    const limit = parseInt(pageSize) || 20; 
    // Calcula o deslocamento (offset) para a página atual
    const offset = (parseInt(page) - 1) * limit;

    // Sequelize's findAndCountAll: busca os dados (rows) e conta o total (count) em uma query.
    const { count, rows } = await model.findAndCountAll({
        limit: limit,
        offset: offset,
        // Ordenação é importante para paginação consistente
        order: [['id', 'ASC']] 
    });

    return {
        data: rows,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
    };
};

/**
 * Rotas de busca de Clientes
 */
exports.getCustomers = async (req, res) => {
    try {
        const { page = 1, pageSize = 20 } = req.query;
        const result = await getPaginatedData(Customer, page, pageSize);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        return res.status(500).json({ message: 'Erro interno ao buscar clientes.' });
    }
};

/**
 * Rotas de busca de Produtos
 */
exports.getProducts = async (req, res) => {
    try {
        const { page = 1, pageSize = 20 } = req.query;
        const result = await getPaginatedData(Product, page, pageSize);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        return res.status(500).json({ message: 'Erro interno ao buscar produtos.' });
    }
};