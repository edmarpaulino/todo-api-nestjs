# Documento de Planejamento - TODO API

## 1. Visão Geral do Projeto

| Item                  | Descrição                                                                                                                                        |
| :-------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nome da API**       | TODO API                                                                                                                                         |
| **Objetivo**          | Fornecer uma API RESTful para gerenciamento de tarefas pessoais (to-dos), incluindo funcionalidades de autenticação e gerenciamento de usuários. |
| **Público-alvo**      | Aplicações _front-end_ (Web/Mobile) que necessitam de um _backend_ robusto para tarefas.                                                         |
| **Stack Tecnológica** | NodeJS, NestJS, TypeScript, PrismaORM, MongoDB, JWT, Bcrypt                                                                                      |
| **Banco de Dados**    | MongoDB (via PrismaORM)                                                                                                                          |

---

## 2. Configuração da Stack e Infraestrutura

| Tipo               | Item de Planejamento                             | Detalhes Técnicos                                                                       |
| :----------------- | :----------------------------------------------- | :-------------------------------------------------------------------------------------- |
| **Configuração**   | Configurar o projeto NestJS.                     | Inicializar projeto NestJS e configurar o ambiente TypeScript.                          |
| **Infraestrutura** | Configurar o ambiente de banco de dados MongoDB. | Criação do _container_ Docker (ou conexão) para MongoDB.                                |
| **ORM/BD**         | Integrar e configurar o Prisma ORM com MongoDB.  | Configurar o `schema.prisma` com os modelos `User` e `Todo`.                            |
| **Autenticação**   | Configurar módulos de JWT e Bcrypt.              | Instalar dependências e configurar os módulos de autenticação e criptografia no NestJS. |

---

## 3. Schemas (Modelos de Dados)

### Schema: `User`

| Campo      | Tipo              | Descrição                       | Restrições                |
| :--------- | :---------------- | :------------------------------ | :------------------------ |
| `id`       | String (ObjectID) | Identificador único do usuário. | PK (Chave Primária)       |
| `name`     | String            | Nome completo do usuário.       | Obrigatório               |
| `email`    | String            | E-mail do usuário.              | Obrigatório, Único        |
| `password` | String            | Senha criptografada (hash).     | Obrigatório (Após Bcrypt) |

### Schema: `Todo`

| Campo         | Tipo              | Descrição                                 | Restrições                          |
| :------------ | :---------------- | :---------------------------------------- | :---------------------------------- |
| `id`          | String (ObjectID) | Identificador único da tarefa.            | PK (Chave Primária)                 |
| `title`       | String            | Título principal da tarefa.               | Obrigatório                         |
| `description` | String            | Descrição detalhada da tarefa.            | Opcional                            |
| `userId`      | String (ObjectID) | Referência ao usuário que criou a tarefa. | FK (Chave Estrangeira), Obrigatório |
| `status`      | Enum (TodoStatus) | Status da tarefa (DO, DOING, DONE).       | Obrigatório (Padrão: DO)            |

---

## 4. Histórias de Usuário e Funcionalidades

### 4.1. Autenticação e Autorização

| ID          | Tipo                 | História de Usuário (User Story)                                                                                                                                                                   | Critérios de Aceitação                                                                                                                                                                                                                                  | Rota(s)                                       |
| :---------- | :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------- |
| **AUTH-01** | **Criação de Conta** | **Como um novo usuário**, eu quero me cadastrar fornecendo nome, e-mail, senha e confirmação de senha, **para ter acesso** ao sistema.                                                             | 1. O sistema deve validar se a senha e `passwordConfirmation` são iguais. 2. O e-mail deve ser validado (formato e unicidade). 3. A senha deve ser criptografada com Bcrypt antes de salvar. 4. Em caso de sucesso, deve retornar um `authToken` (JWT). | `POST /sign-up`                               |
| **AUTH-02** | **Login**            | **Como um usuário registrado**, eu quero fazer login fornecendo meu e-mail e senha, **para receber** um token de autenticação e acessar minhas tarefas.                                            | 1. O sistema deve verificar as credenciais (e-mail e senha criptografada) no banco de dados. 2. Em caso de sucesso, deve retornar um `authToken` (JWT). 3. Em caso de falha, deve retornar um erro de credenciais inválidas.                            | `POST /sign-in`                               |
| **AUTH-03** | **Autorização**      | **Como um usuário**, eu quero que todas as rotas de gerenciamento de tarefas e de edição/exclusão de usuário sejam protegidas, **para garantir** que apenas eu possa acessar/modificar meus dados. | 1. Implementar um _Guard_ (NestJS) que valide o `authToken` (JWT) em todas as rotas protegidas (exceto Sign-up/Sign-in). 2. O token deve ser verificado a cada requisição.                                                                              | Todas as rotas (exceto `sign-up` e `sign-in`) |

### 4.2. Gerenciamento de Usuário

| ID          | Tipo                  | História de Usuário (User Story)                                                                                            | Critérios de Aceitação                                                                                                                                                                                                                                                                                   | Rota(s)             |
| :---------- | :-------------------- | :-------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------ |
| **USER-01** | **Edição de Dados**   | **Como um usuário autenticado**, eu quero editar meu nome, e-mail ou senha, **para manter** minhas informações atualizadas. | 1. A rota deve ser protegida (Auth-03). 2. O usuário só pode editar o próprio registro (`userId` do token deve ser igual a `{id}` da rota). 3. Se a senha for alterada, a nova senha deve ser criptografada (Bcrypt). 4. O `passwordConfirmation` deve ser verificado se a senha estiver sendo alterada. | `PATCH /user/{id}`  |
| **USER-02** | **Exclusão de Conta** | **Como um usuário autenticado**, eu quero deletar minha conta, **para remover** permanentemente meus dados do sistema.      | 1. A rota deve ser protegida (Auth-03). 2. O usuário só pode deletar o próprio registro. 3. Todos os dados associados (tarefas - `todo`) devem ser deletados.                                                                                                                                            | `DELETE /user/{id}` |

### 4.3. Gerenciamento de Tarefas (TODOs)

| ID          | Tipo                    | História de Usuário (User Story)                                                                                                                                 | Critérios de Aceitação                                                                                                                                                                       | Rota(s)            |
| :---------- | :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------- |
| **TODO-01** | **Criação de Tarefa**   | **Como um usuário autenticado**, eu quero criar uma nova tarefa fornecendo um título e opcionalmente uma descrição, **para registrar** o que precisa ser feito.  | 1. A rota deve ser protegida (Auth-03). 2. A tarefa deve ser vinculada ao `userId` do token. 3. O campo `done` deve ser iniciado como `false`.                                               | `POST /todo`       |
| **TODO-02** | **Listagem de Tarefas** | **Como um usuário autenticado**, eu quero visualizar todas as minhas tarefas, **para saber** o que está pendente e o que está completo.                          | 1. A rota deve ser protegida (Auth-03). 2. Deve retornar apenas as tarefas vinculadas ao `userId` do token. 3. Opcional: Implementar filtros (ex: por `done`) e paginação.                   | `GET /todo`        |
| **TODO-03** | **Edição de Tarefa**    | **Como um usuário autenticado**, eu quero editar o título, a descrição ou o status (`done`) de uma tarefa existente, **para mantê-la** atualizada.               | 1. A rota deve ser protegida (Auth-03). 2. O usuário só pode editar tarefas que ele criou (`todo.userId` deve ser igual ao `userId` do token). 3. Deve-se validar se a tarefa `{id}` existe. | `PATCH /todo/{id}` |
| **TODO-04** | **Exclusão Múltipla**   | **Como um usuário autenticado**, eu quero deletar múltiplas tarefas de uma vez, fornecendo uma lista de IDs, **para limpar** rapidamente tarefas desnecessárias. | 1. A rota deve ser protegida (Auth-03). 2. O _body_ deve aceitar um _array_ de `todoId`. 3. O sistema deve garantir que todas as tarefas deletadas pertençam ao `userId` do token.           | `DELETE /todo`     |

---

## 5. Próximos Passos (Plano de Ação Sugerido)

1. **Setup Inicial:** Configurar o projeto NestJS, Prisma e integração com MongoDB.
2. **Módulo de Autenticação:** Implementar rotas `POST /sign-up` e `POST /sign-in`, incluindo Bcrypt e JWT.
3. **Guard/Middleware:** Criar e aplicar o Guard de Autorização (JWT) nas rotas protegidas.
4. **Módulo de Usuário:** Implementar as funcionalidades de `PATCH /user/{id}` e `DELETE /user/{id}`, garantindo a restrição de que o usuário só modifica/deleta a própria conta.
5. **Módulo de Tarefas (CRUD):** Implementar as funcionalidades de criação, listagem, edição e exclusão de tarefas, validando sempre o `userId` em todas as operações.
6. **Testes:** Desenvolver testes unitários e de integração para as funcionalidades críticas (Autenticação e CRUD de Tarefas).
7. **Documentação:** Criar documentação da API (ex: utilizando Swagger/OpenAPI).
