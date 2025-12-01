// controllers/authController.js (Nova função exports.login)

// ... (Restante do código, como as importações e a constante JWT_SECRET)

/**
 * Lógica para fazer login de um usuário existente
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  try {
    // 1. Procurar o usuário pelo email
    const user = await User.findOne({ where: { email } });

    // 2. Verificar se o usuário existe
    if (!user) {
      // Usar a mesma mensagem de erro para não dar dicas sobre a existência do email
      return res.status(401).json({ message: 'Credenciais inválidas.' }); 
    }

    // 3. Comparar a senha fornecida com a senha criptografada no DB
    // O bcrypt.compare desfaz a criptografia da senha enviada e compara com a do DB
    const isPasswordValid = await bcrypt.compare(password, user.password); 

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // 4. Gerar um novo Token JWT para a sessão
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1d', // Token expira em 1 dia
    });

    // 5. Resposta de sucesso
    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      user: { id: user.id, email: user.email, username: user.username },
      token, // Envia o token para o frontend
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// ... (Restante do código, como a função exports.signup)