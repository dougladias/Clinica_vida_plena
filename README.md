# Sistema Vida Plena - Backend

Sistema completo de gerenciamento clínica e consultorio médico desenvolvido com Node.js, TypeScript, Express e Prisma ORM, utilizando PostgreSQL como banco de dados.

## 🛠 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset JavaScript com tipagem
- **Express.js** - Framework web
- **Prisma ORM** - Object-Relational Mapping
- **PostgreSQL** - Banco de dados relacional
- **JWT (jsonwebtoken)** - Autenticação
- **bcryptjs** - Criptografia de senhas
- **CORS** - Cross-Origin Resource Sharing

## 🚀 Instalação

### Pré-requisitos
- Node.js (v18 ou superior)
- PostgreSQL
- npm ou yarn

### Passos para instalação

1. **Clone o repositório**

- ( Abra o Terminal Bash ou qualquer outro terminal com autorização para usar node.js )

2. **Instale as dependências do Backend**

- ( Abra o Terminal do vs code na Pasta Backend )

- Digite o Comando *** npm i ou npm install  *** para instalar as dependências do backend

3. **Configure as variáveis de ambiente**

- ( Criar um arquivo chamado *** .env *** na pasta raiz do backend e coloque as variáveis de ambiente )

### Comunicação com o Banco de dados DATABASE_URL
### mude a Senha e o nome do banco de dados conforme o seu ou crie a um banco de dados
### no PG ADM Postgres com SENHA E BANCO DE DADOS IGUAL AO DO PROJETO.

### SENHA: 1425
### TABELA: VidaPlena

*** Cole no arquivo .env ***

# Environment variables for the backend application
DATABASE_URL="postgresql://postgres:1425@localhost:5432/VidaPlena?schema=public"

### Chave de segurança pode utilizar a mesma ela esta criptografada.

# Secret JWT
JWT_SECRET=875ddfd6c2668d2a4f85ea19ab3c1b82

4. **Execute as migrações do banco**

- ( Abra o Terminal do vs code na Pasta Backend )

*** Digite esse comando para criar as tabelas no Banco de dados Postgres ***

- npx prisma migrate dev

5. **Gere o clientPrisma**

- ( No mesmo terminal do Passo 4 Digite o comando para gerar as tabelas do projeto )

- npx prisma generate


6. **Inicie o servidor do Backend**

- ( No mesmo terminal do Passo 5 Digite o comando para iniciar o projeto e veja a mensagem *** Servidor Rodando na Porta 4000 *** )

- npm run dev

7. **Instale as dependências do Frontend**

- ( Abra o Terminal do vs code na Pasta frontend/vidaplena )

- Digite o Comando *** npm i ou npm install  *** para instalar as dependências do frontend

8. **Inicie o servidor do Frontend**

- ( No mesmo terminal do Passo 7 Digite o comando para iniciar o projeto e veja a mensagem *** localhost 3000 *** )

- Digite o Comando *** npm run dev ***

## 📁 Estrutura do Projeto

```
backend/
├── prisma/
│   ├── migrations/          # Migrações do banco de dados
│   └── schema.prisma        # Schema do Prisma
├── src/
│   ├── controllers/         # Controladores da API 
│   ├── middlewares/         # Middlewares (autenticação)
│   ├── prisma/              # Configuração do Prisma Client
│   ├── routes/              # Definição das rotas
│   ├── services/            # Lógica de negócio
│   ├── types/               # Definições de tipos TypeScript
│   └── server.ts            # Configuração do servidor
├── .env                     # Variáveis de ambiente
├── package.json             # Dependências e scripts
└── tsconfig.json            # Configuração TypeScript
```

## 🔒 Segurança

- **Autenticação JWT**: Tokens seguros para acesso às rotas protegidas
- **Criptografia de Senhas**: Uso do bcryptjs para hash das senhas
- **Validação de Dados**: Validações rigorosas em todos os endpoints
- **Controle de Acesso**: Middleware de autenticação para rotas protegidas

**Sistema Vida Plena** - Transformando o cuidado médico através da tecnologia 🏥💙