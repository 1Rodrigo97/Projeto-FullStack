// server.js

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors'); 
require('dotenv').config();
// A variável 'port' agora pode ler process.env.PORT
const port = process.env.PORT || 3000;

// ------------------------------------------
// 1. IMPORTAÇÕES DE DB e ROTAS
// ------------------------------------------
const sequelize = require('./config/database');
const User = require('./models/User'); 
const Task = require('./models/Task'); 
const Customer = require('./models/Customer'); // <--- NOVO
const Product = require('./models/Product'); // <--- NOVO
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); 
const taskRoutes = require('./routes/taskRoutes'); 
const importRoutes = require('./routes/importRoutes');
const dataRoutes = require('./routes/dataRoutes');

// ------------------------------------------
// 2. CONFIGURAÇÕES DE MIDDLEWARE
// ------------------------------------------

// 2.1. O CORS DEVE VIR PRIMEIRO PARA DESBLOQUEAR A COMUNICAÇÃO
app.use(cors()); 

// 2.2. Middleware para servir arquivos estáticos (Frontend Vue.js)
app.use(express.static(path.join(__dirname, 'public')));
// 2.3. Middleware para processar requisições com corpo JSON
app.use(express.json());

// ------------------------------------------
// 3. DEFINIÇÃO DAS ROTAS DA API
// ------------------------------------------

//Rotas públicas de autenticação (Signup, Login)
app.use('/api/auth', authRoutes);

// Rotas privadas de usuário
app.use('/api/users', userRoutes); 

// Rotas de CRUD de Tarefas
app.use('/api/tasks', taskRoutes);

// NOVAS ROTAS DE IMPORTAÇÃO DE CSV
app.use('/api/import', importRoutes);

app.use('/api/data', dataRoutes); // <--- ESSENCIAL: USAR NO ENDPOINT /api/data

// ------------------------------------------
// 4. ROTA CATCH-ALL PARA O FRONTEND (SPA)
// ------------------------------------------
// ⚠️ Usamos app.use em vez de app.get para ser menos estrito no roteamento.
// Esta rota deve ser a ÚLTIMA! Ela lida com todos os caminhos restantes.
app.use((req, res) => {
    // A rota estática já serviu o index.html na raiz (/). 
    // Esta lógica é para sub-rotas como /perfil.
    if (!req.url.startsWith('/api')) {
        return res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
    
    // CORREÇÃO: Se for uma rota de API não encontrada (404), retorna JSON VÁLIDO.
    return res.status(404).json({ message: 'API endpoint not found.' });
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