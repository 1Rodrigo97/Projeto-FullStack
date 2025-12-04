# Projeto Full-Stack Monolítico (Node.js, Express, Vue.js, Sequelize)

Este projeto é uma prova de conceito de uma aplicação full-stack monolítica, demonstrando a integração completa entre um backend RESTful (Node.js/Express) e um frontend SPA (Vue.js). O foco principal é a implementação robusta de **Autenticação JWT** e a criação de funcionalidades **CRUD protegidas**.

---

## ⚙️ Tecnologias Utilizadas (Tech Stack)

| Categoria | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Backend** | Node.js, Express.js | Servidor RESTful e API Gateway. |
| **Banco de Dados** | Sequelize ORM, SQLite | Mapeamento Objeto-Relacional (ORM) usando um banco de dados local. |
| **Autenticação** | JSON Web Tokens (JWT) | Mecanismo de autenticação *stateless* (sem estado). |
| **Frontend** | Vue.js 3 | Frontend Single Page Application (SPA) usando a Composition API (via CDN). |
| **Segurança** | BCrypt, CORS | Hashing de senhas e liberação de acesso entre origens. |

---

## ✨ Funcionalidades Principais

O projeto implementa as seguintes funcionalidades, todas protegidas por um **Auth Middleware** para garantir que apenas usuários autenticados possam acessar rotas sensíveis:

* **Autenticação JWT:** Rotas para Cadastro (`/signup`) e Login (`/login`).
* **Persistência de Sessão:** Token JWT e dados de usuário salvos no `localStorage`.
* **Perfil do Usuário:** Rota protegida para acessar dados do perfil (`/api/users/profile`).
* **CRUD de Tarefas:** Implementação completa de **Criar, Ler, Atualizar e Excluir** tarefas, restritas ao usuário autenticado.

---

## 🚀 Executando o Projeto

Siga os passos abaixo para configurar e rodar a aplicação em seu ambiente local.

### 1. Clonar o Repositório

```bash
git clone [https://github.com/1Rodrigo97/Projeto-FullStack.git](https://github.com/1Rodrigo97/Projeto-FullStack.git)
cd Projeto-FullStack
# Opcional: code . (para abrir no VS Code)