// controllers/authController.js (Código Completo)

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const JWT_SECRET = process.env.JWT_SECRET || 'umaChaveSecretaMuitoForte12345'; 
const SALT_ROUNDS = 10; 

/**
 * Lógica para registrar um novo usuário
 */
exports.signup = async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await User.create({
      email,
      username: username || email, 
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, {
      expiresIn: '1d', 
    });

    return res.status(201).json({ 
      message: 'Usuário registrado com sucesso!', 
      user: { id: newUser.id, email: newUser.email, username: newUser.username },
      token 
    });

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Este e-mail já está em uso.' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Erro interno ao registrar usuário.' });
  }
};

/**
 * Lógica para fazer login de um usuário existente
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1d', 
    });

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      user: { id: user.id, email: user.email, username: user.username },
      token,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};