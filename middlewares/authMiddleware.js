// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

// A chave secreta deve ser a mesma usada para gerar o token
const JWT_SECRET = process.env.JWT_SECRET || 'umaChaveSecretaMuitoForte12345'; 

/**
 * Middleware para verificar se o token JWT é válido
 */
exports.verifyToken = (req, res, next) => {
  // 1. O token geralmente vem no cabeçalho (header) Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  // 2. Extrai o token removendo o prefixo "Bearer "
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verifica e decodifica o token usando a chave secreta
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 4. Anexa os dados do usuário (id e email) à requisição
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    
    // 5. Continua para a próxima função da rota (a função original que o usuário queria acessar)
    next();
  } catch (error) {
    // 6. Se a verificação falhar (token expirado, alterado ou inválido)
    return res.status(403).json({ message: 'Token inválido ou expirado.' });
  }
};