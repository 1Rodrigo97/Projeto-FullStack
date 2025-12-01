// controllers/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Nosso modelo de Usuário

// Chave secreta: usar no .env é obrigatório, mas para testar, vamos usar um valor padrão
// Em um projeto real, NUNCA use um valor fixo aqui.
const JWT_SECRET = process.env.JWT_SECRET || 'umaChaveSecretaMuitoForte12345'; 

// Funções utilitárias:
const SALT_ROUNDS = 10; // Nível de dificuldade para criptografar a senha

/**
 * Lógica para registrar um novo usuário
 */
exports.signup = async (req, res) => {
  const { email, password, username } = req.body;

  // 1. Validação básica (ver se o corpo da requisição está ok)
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  try {
    // 2. Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 3. Criar o usuário no banco de dados
    const newUser = await User.create({
      email,
      username: username || email, // Se não tiver username, usa o email
      password: hashedPassword,
    });

    // 4. Gerar o Token de Acesso (JWT)
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, {
      expiresIn: '1d', // Token expira em 1 dia
    });

    // 5. Resposta de sucesso
    return res.status(201).json({ 
      message: 'Usuário registrado com sucesso!', 
      user: { id: newUser.id, email: newUser.email, username: newUser.username },
      token 
    });

  } catch (error) {
    // Tratamento de erro (ex: email duplicado)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Este e-mail já está em uso.' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Erro interno ao registrar usuário.' });
  }
};