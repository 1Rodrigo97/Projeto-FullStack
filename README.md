# Projeto Full-Stack Monolítico (Node.js, Express, Vue.js, PostgreSQL)

Este projeto é uma prova de conceito de uma aplicação full-stack monolítica, demonstrando a integração completa entre um backend RESTful (Node.js/Express) e um frontend SPA (Vue.js). O foco principal é a **migração para PostgreSQL** e a implementação de rotinas de **Importação e Visualização Paginada** de grandes volumes de dados.

---

## ⚙️ Tecnologias Utilizadas (Tech Stack)

| Categoria | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Backend** | Node.js, Express.js | Servidor RESTful e API Gateway. |
| **Banco de Dados** | Sequelize ORM, **PostgreSQL** | Mapeamento Objeto-Relacional (ORM) usando um banco de dados relacional robusto. |
| **Manipulação de Dados**| **Multer, csv-parser** | Processamento de upload de arquivos e leitura/inserção de dados CSV (Bulk Insert). |
| **Autenticação** | JSON Web Tokens (JWT) | Mecanismo de autenticação *stateless* (sem estado). |
| **Frontend** | Vue.js 3 | Frontend Single Page Application (SPA) usando a Composition API (via CDN). |
| **Segurança** | BCrypt, CORS | Hashing de senhas e liberação de acesso entre origens. |

---

## ✨ Funcionalidades Principais

O projeto implementa as seguintes funcionalidades, todas com rotas protegidas por um **Auth Middleware**:

* **Autenticação JWT:** Rotas para Cadastro (`/signup`) e Login (`/login`).
* **CRUD de Tarefas:** Implementação completa de Criar, Ler, Atualizar e Excluir tarefas, restritas ao usuário autenticado.
* **Importação de CSV:** Rotas protegidas para upload e processamento em massa de arquivos **`Products.csv`** e **`Customers.csv`** para o PostgreSQL.
* **Visualização de Dados (Paginação):** Interface performática para exibir e navegar em grandes volumes de dados (mais de 200.000 registros) usando `LIMIT` e `OFFSET` do SQL.

---

## 🚀 Executando o Projeto

Siga os passos abaixo para configurar e rodar a aplicação em seu ambiente local.

### 1. Pré-requisitos

Você precisa ter instalado em sua máquina:
* **Node.js** (versão LTS recomendada)
* **npm** (instalado junto com o Node.js)
* **PostgreSQL** (Rodando localmente na porta 5432)

### 2. Instalação e Configuração

Clone o repositório e navegue até a pasta do projeto:

```bash
git clone [https://github.com/1Rodrigo97/Projeto-FullStack.git](https://github.com/1Rodrigo97/Projeto-FullStack.git)
cd Projeto-FullStack
# Opcional: code . (para abrir no VS Code)