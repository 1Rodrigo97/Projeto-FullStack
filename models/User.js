// models/User.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa a conexão

// Define o modelo "User"
const User = sequelize.define('User', {
  // Coluna ID: criada automaticamente pelo Sequelize
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  
  // Coluna EMAIL
  email: {
    type: DataTypes.STRING,
    allowNull: false, // Não pode ser nulo
    unique: true,     // Deve ser único (para o login)
    validate: {
      isEmail: true, // Garante que seja um formato de e-mail válido
    },
  },
  
  // Coluna PASSWORD
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  // Opcional: Para saber quem criou o registro
  username: {
    type: DataTypes.STRING,
    allowNull: true, 
  }
}, {
  // Outras opções do modelo
  timestamps: true, // Adiciona colunas createdAt e updatedAt
});

module.exports = User;