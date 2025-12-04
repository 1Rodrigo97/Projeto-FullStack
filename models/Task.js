// models/Task.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Importa o modelo User

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

// Define a relação: Uma Tarefa pertence a um Usuário.
Task.belongsTo(User, {
  foreignKey: 'userId', 
  onDelete: 'CASCADE'   
});
User.hasMany(Task, { 
  foreignKey: 'userId' 
});

module.exports = Task;