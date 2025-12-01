// config/database.js

const { Sequelize } = require('sequelize');
const path = require('path');

// Cria uma instância do Sequelize
// 'development' é o nome arbitrário da conexão
const sequelize = new Sequelize('database', 'username', 'password', {
  // Configuração para usar SQLite
  dialect: 'sqlite',
  // Especifica onde o arquivo .sqlite será criado
  storage: path.join(__dirname, '..', 'database.sqlite'), 
  
  // Opcional: Para evitar logs desnecessários no console
  logging: false, 
});

module.exports = sequelize;