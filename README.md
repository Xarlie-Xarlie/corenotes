# CoreNotes

Full-stack application designed to manage to-do notes, built using Node.js and React.js.

![demo](output.gif)

## Project Goal

The main goal of this project is to put into practice my full-stack development skills. The project includes:

- Developing a complete API with Node.js.
- Building the frontend with React.js.
- Creating unit tests for all backend actions, with mocking.
- Creating unit tests for all frontend actions, with mocking.
- Increasing test coverage over time.

## Features

- Node.js with Express and MVC pattern for the API.
- React.js for the frontend.
- Continuous Integration (CI) pipeline included.
- Test coverage reports included.
- Dockerized environment for easy setup and deployment.

## How to Run

### Using Docker

If you have Docker and Docker Compose installed, follow these steps:

1. Start the application:

   ```bash
   docker-compose up -d
   ```

2. Run database migrations:

   ```bash
   docker exec -it corenotes-backend-1 npx sequelize-cli db:migrate
   ```

3. (Optional) Run database seeds:

   ```bash
   docker exec -it corenotes-backend-1 npx sequelize-cli db:seed:all
   ```

4. Access the application in your browser:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API Docs: [http://localhost:3333/docs](http://localhost:3333/docs)

### Running Without Docker

For instructions on how to run the project without Docker,
please refer to the specific guides in the `frontend/README.md`
and `backend/README.md` files. These guides include details on configuring development and testing environments.
