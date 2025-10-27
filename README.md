# TODO API

## Project Overview

This project consists of a RESTful API for managing personal tasks (to-dos), including authentication and user management functionalities. It is designed to be a robust backend for front-end applications (Web/Mobile).

### Technology Stack

- **Language:** TypeScript
- **Framework:** NestJS
- **ORM:** PrismaORM
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Encryption:** Bcrypt

## Stack and Infrastructure Configuration

The project uses Docker for the MongoDB database environment configuration.

### NestJS Project Configuration

The project was initialized with NestJS and configured with TypeScript.

### MongoDB Database Environment Configuration

The MongoDB infrastructure is provisioned via Docker, using the `docker-compose.yml` file.

### Prisma ORM Integration and Configuration with MongoDB

Prisma ORM is integrated and configured to interact with MongoDB. The `schema.prisma` defines the `User` and `Todo` models.

### JWT and Bcrypt Modules Configuration

Dependencies for JWT and Bcrypt are installed, and the authentication and encryption modules are configured in NestJS.

## Schemas (Data Models)

### Schema: `User`

| Field      | Type              | Description                | Constraints             |
| :--------- | :---------------- | :------------------------- | :---------------------- |
| `id`       | String (ObjectID) | Unique user identifier.    | PK (Primary Key)        |
| `name`     | String            | User's full name.          | Required                |
| `email`    | String            | User's email.              | Required, Unique        |
| `password` | String            | Encrypted password (hash). | Required (After Bcrypt) |

### Schema: `Todo`

| Field         | Type              | Description                           | Constraints                |
| :------------ | :---------------- | :------------------------------------ | :------------------------- |
| `id`          | String (ObjectID) | Unique task identifier.               | PK (Primary Key)           |
| `title`       | String            | Main title of the task.               | Required                   |
| `description` | String            | Detailed description of the task.     | Optional                   |
| `userId`      | String (ObjectID) | Reference to the user who created it. | FK (Foreign Key), Required |
| `status`      | Enum (TodoStatus) | Task status (DO, DOING, DONE).        | Required (Default: DO)     |

`TodoStatus` Enum: `DO`, `DOING`, `DONE`

## User Stories and Features

### 4.1. Authentication and Authorization

| ID          | Feature              | Route(s)                                    | Description                                                                                                                                                                                                        |
| :---------- | :------------------- | :------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AUTH-01** | **Account Creation** | `POST /sign-up`                             | Allows new users to register by providing name, email, and password. The system validates passwords and email format/uniqueness, encrypts the password with Bcrypt, and returns an `authToken` (JWT) upon success. |
| **AUTH-02** | **Login**            | `POST /sign-in`                             | Allows registered users to log in with their email and password. The system verifies credentials and returns an `authToken` (JWT) upon success, or an invalid credentials error upon failure.                      |
| **AUTH-03** | **Authorization**    | All routes (except `sign-up` and `sign-in`) | All task management and user editing/deletion routes are protected by a NestJS Guard that validates the `authToken` (JWT). The token is verified on each request.                                                  |

### 4.2. User Management

| ID          | Feature            | Route(s)       | Description                                                                                                                                                                                                                                                  |
| :---------- | :----------------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **USER-01** | **Get User Data**  | `GET /user`    | Allows an authenticated user to retrieve their own data. The route is protected (Auth-03) and returns the user's profile information.                                                                                                                        |
| **USER-02** | **Edit Data**      | `PATCH /user`  | Allows an authenticated user to edit their name, email, or password. The route is protected (Auth-03). The user can only edit their own record. If the password is changed, the new password must be encrypted (Bcrypt) and `passwordConfirmation` verified. |
| **USER-03** | **Delete Account** | `DELETE /user` | Allows an authenticated user to delete their own account. The route is protected (Auth-03), and the system ensures that only the user's own record is deleted, along with all associated data (tasks).                                                       |

### 4.3. Task Management (TODOs)

| ID          | Feature             | Route(s)           | Description                                                                                                                                                                                                                                                                        |
| :---------- | :------------------ | :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TODO-01** | **Create Task**     | `POST /todo`       | Allows an authenticated user to create a new task by providing a title and optionally a description. The task is linked to the `userId` from the token, and the `status` field is initialized as `DO` (default).                                                                   |
| **TODO-02** | **List Tasks**      | `GET /todo`        | Allows an authenticated user to view all their tasks. Only tasks linked to the `userId` from the token are returned. Optionally, filters (e.g., by `status`) and pagination can be implemented.                                                                                    |
| **TODO-03** | **Edit Task**       | `PATCH /todo/{id}` | Allows an authenticated user to edit the title, description, or status of an existing task. The route is protected (Auth-03), and the user can only edit tasks they created (`todo.userId` must match the `userId` from the token). The existence of the task `{id}` is validated. |
| **TODO-04** | **Delete Multiple** | `DELETE /todo`     | Allows an authenticated user to delete multiple tasks at once by providing a list of IDs in the request body. The route is protected (Auth-03), and the system ensures that all deleted tasks belong to the `userId` from the token.                                               |

## How to Run the Project Locally

Follow the steps below to set up and run the project locally.

### Prerequisites

Make sure you have the following software installed on your machine:

- Node.js (version 18 or higher)
- npm (Node.js package manager)
- Docker and Docker Compose

### 1. Clone the Repository

```bash
git clone https://github.com/edmarpaulino/todo-api-nestjs.git
cd todo-api
```

### 2. Configure Environment Variables

This project uses environment variables for configuration. A `.env.example` file is provided as a template.

1.  Copy the `.env.example` file to `.env` in the project root:
    ```bash
    cp .env.example .env
    ```
2.  Open the newly created `.env` file and fill in the values

### 3. Start MongoDB Database with Docker Compose

```bash
npm run compose:up
```

This command will bring up a Docker container for MongoDB. You can verify if the container is running with `docker ps`.

### 4. Generate Keyfile for MongoDB Replica Set (Optional, but recommended for production)

```bash
npm run mongodb:keyfile
```

This script generates a `keyfile` to configure MongoDB as a replica set, which is important for production environments and some Prisma functionalities.

### 5. Generate Prisma Client

After configuring `schema.prisma` and having MongoDB running, generate the Prisma client:

```bash
npm run generate
```

### 6. Install Dependencies

```bash
npm install
```

### 7. Run the Application

To run the application in development mode (with hot-reload):

```bash
npm run start:dev
```

To run the application in production mode:

```bash
npm run start:prod
```

The API will be available at `http://localhost:3000` (or the port configured in your `.env`).

## API Documentation (Swagger)

The interactive API documentation is available via Swagger. After starting the application, access:

`http://localhost:3000/api` (or `http://localhost:[PORT]/api`)
