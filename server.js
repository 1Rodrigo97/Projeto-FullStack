// server.js - Versão Final de Backend

const express = require('express');
const app = express();
const path = require('path'); // Necessário para servir arquivos estáticos e HTML
require('dotenv').config(); 
const port = process.env.PORT || 3000; 

// ------------------------------------------
// 1. IMPORTAÇÕES DE DB e ROTAS
// ------------------------------------------
const sequelize = require('./config/database');
const User = require('./models/User'); 
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // <-- Rota Protegida

// ------------------------------------------
// 2. CONFIGURAÇÕES DE MIDDLEWARE
// ------------------------------------------

// Middleware para servir arquivos estáticos (Frontend Vue.js)
app.use(express.static(path.join(__dirname, 'public'))); 

// Middleware para processar requisições com corpo JSON
app.use(express.json()); 

// ------------------------------------------
// 3. DEFINIÇÃO DAS ROTAS
// ------------------------------------------

// Rotas públicas de autenticação (Signup, Login)
app.use('/api/auth', authRoutes);

// Rotas privadas que exigem autenticação (Ex: /api/users/profile)
app.use('/api/users', userRoutes); 

// Rota Catch-all (para o Frontend): serve o index.html em qualquer rota não-API
// Isso é essencial para o conceito de SPA (Single Page Application)
app.get('*', (req, res) => {
    // Verifica se a requisição não é para uma API antes de servir o HTML
    if (!req.url.startsWith('/api')) {
        return res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
    // Caso contrário, deixa o Express tratar a rota ou retornar um 404
});

// ------------------------------------------
// 4. FUNÇÃO PARA INICIAR O SERVIDOR E SINCRONIZAR O DB
// ------------------------------------------
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // Sincroniza todos os modelos (cria ou altera as tabelas)
    await sequelize.sync({ alter: true }); 
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