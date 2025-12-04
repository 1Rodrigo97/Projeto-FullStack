// config/database.js (VERSÃO CORRIGIDA)

const { Sequelize } = require('sequelize');

if (!process.env.DATABASE_URL) {
  console.error("ERRO: DATABASE_URL não está definida no .env. Configure o PostgreSQL.");
  process.exit(1); 
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, 
  // 🚨 CORREÇÃO: Remova ou comente o bloco SSL para conexões locais.
  // Deixamos vazio, ou definimos 'ssl: false' se necessário.
  dialectOptions: {
      // Para o localhost, não exigimos SSL
      // ssl: false 
  }
  // Se fosse para produção (nuvem), usaríamos o bloco SSL:
  /*
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  }
  */
});

module.exports = sequelize;