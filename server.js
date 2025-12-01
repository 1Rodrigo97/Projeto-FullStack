// server.js

const express = require('express');
const app = express();
require('dotenv').config(); // Carrega .env
const port = process.env.PORT || 3000; // Boa prática: usar porta de variável de ambiente

// ------------------------------------------
// 1. IMPORTAÇÕES DO BANCO DE DADOS
// ------------------------------------------
const sequelize = require('./config/database');
const User = require('./models/User'); // Importa o modelo que criamos
// ------------------------------------------

// Middleware para processar JSON nas requisições
app.use(express.json());

// Rota de Teste Simples
app.get('/', (req, res) => {
  res.send('Servidor Express rodando com sucesso!');
});

// ------------------------------------------
// 2. FUNÇÃO PARA INICIAR O SERVIDOR E SINCRONIZAR O DB
// ------------------------------------------
async function startServer() {
  try {
    // Tenta autenticar a conexão com o banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // Sincroniza todos os modelos (cria as tabelas se não existirem)
    // Model.sync() é o que você pediu. Podemos usar o sequelize.sync() para todos.
    await sequelize.sync({ alter: true }); // O { alter: true } tenta fazer alterações não destrutivas
    console.log('Modelos de banco de dados sincronizados.');

    // Inicia o Servidor
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Não foi possível conectar ou sincronizar o banco de dados:', error);
  }
}

startServer();
// ------------------------------------------