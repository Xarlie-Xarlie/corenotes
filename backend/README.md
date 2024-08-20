# CoreNotes Backend

This project is a Web API built with Node.js v22.6.0 and Express. It uses Sequelize as an ORM to interact with a PostgreSQL database, and Swagger with JSDoc for API documentation.

The backend is used by the frontend to interact with the database, and you can also use tools like Postman or Insomnia to make HTTP requests.

## How to Run Locally

### 1. Install Dependencies

In the project directory, install the required dependencies:

```bash
npm install
```

### 2. Set Up PostgreSQL Database

Start the PostgreSQL container:

```bash
docker-compose up -d postgres
```

Create the database:

```bash
docker exec -it corenotes-postgres-1 psql -U postgres -c "CREATE DATABASE notesdb;"
```

### 3. Migrate Database

Apply the database migrations:

```bash
npx sequelize-cli db:migrate
```

### 4. Run Seeds (Optional)

If you want to seed the database with initial data:

```bash
npx sequelize-cli db:seed:all
```

### 5. Start the Application

To start the application, use:

```bash
npm start
```

For watch mode (auto-restart on changes), use:

```bash
npm run start:watch
```

### 6. Access API Documentation

Open the Swagger docs in your browser:
[http://localhost:3333/docs](http://localhost:3333/docs)

## How to Test

All actions in this API is covered by tests.

### 1. Set Up the Test Database

Ensure your PostgreSQL database is running, then create a test database:

```bash
docker exec -it corenotes-postgres-1 psql -U postgres -c "CREATE DATABASE notesdb_test;"
```

### 2. Run Tests

You can run the tests with:

```bash
npm test
```

For watch mode (auto-restart on changes), use:

```bash
npm run test:watch
```

### 3. Run Test Coverage

To check test coverage, use:

```bash
npm run coverage
```

## Project Structure

```bash
backend
├── /config/database.json    # Database credentials file
├── /src/config/db.js        # Sequelize database configuration
├── /src/controllers         # Route controllers
├── /src/migrations          # Migrations folder
├── /src/models              # Models interacting with the database
├── /src/routes              # All API routes
├── /src/seeders             # Seed scripts
├── /src/services            # Services interacting with models
├── /src/server.js           # Main server file that starts the application
├── /src/swagger.js          # Swagger docs helper for JSDoc-based documentation
└── /src/tests               # Tests folder
```
