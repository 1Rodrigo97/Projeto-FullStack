// server.js - Versão Final e Limpa

const express = require('express');
const app = express();
const path = require('path'); 
require('dotenv').config(); 
const port = process.env.PORT || 3000; 

// ------------------------------------------
// 1. IMPORTAÇÕES DE DB e ROTAS
// ------------------------------------------
const sequelize = require('./config/database');
const User = require('./models/User'); 
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); 

// ------------------------------------------
// 2. CONFIGURAÇÕES DE MIDDLEWARE
// ------------------------------------------

// ⚠️ Este é o middleware crucial que diz ao Express para procurar arquivos na pasta 'public'.
app.use(express.static(path.join(__dirname, 'public'))); 

// Middleware para processar requisições com corpo JSON
app.use(express.json()); 

// ------------------------------------------
// 3. DEFINIÇÃO DAS ROTAS DA API
// ------------------------------------------

// Rotas públicas de autenticação (Signup, Login)
app.use('/api/auth', authRoutes);

// Rotas privadas que exigem autenticação (Ex: /api/users/profile)
app.use('/api/users', userRoutes); 

// ------------------------------------------
// 4. ROTA CATCH-ALL PARA O FRONTEND (SPA)
// ------------------------------------------
// ⚠️ Usamos app.use em vez de app.get para ser menos estrito no roteamento.
// Esta rota deve ser a ÚLTIMA! Ela lida com todos os caminhos restantes.
app.use((req, res) => {
    // A rota estática (express.static) já serviu o index.html na raiz (/)
    // Esta lógica lida com sub-rotas como /perfil, que a SPA Vue precisa.
    if (!req.url.startsWith('/api')) {
        return res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
    
    // Se for uma rota de API não encontrada, retorna 404
    res.status(404).send('API endpoint not found');
});
// ------------------------------------------
// 5. FUNÇÃO PARA INICIAR O SERVIDOR E SINCRONIZAR O DB
// ------------------------------------------
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    await sequelize.sync({ alter: true }); 
    console.log('Modelos de banco de dados sincronizados.');

    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Não foi possível conectar ou sincronizar o banco de dados:', error);
  }
}

startServer();