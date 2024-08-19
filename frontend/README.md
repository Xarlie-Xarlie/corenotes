# CoreNotes Frontend

This project is built with React, Tailwind CSS, and JavaScript, and it uses Node.js v22.6.0.

The frontend provides a user interface to interact with notes, which are similar to cards. Users can add a title, description, color, and mark notes as favorites. The frontend communicates with a Node.js API to manage these notes.

## How to Run Locally

### 1. Install Dependencies
In the project directory, install the required dependencies:
```bash
npm install
```

### 2. Start the Application
To start the application and automatically open a new browser tab:
```bash
npm start
```

## How to Test

All actions in the application are covered by tests.

### 1. Run Tests
You can run the tests with:
```bash
npm test
```
For watch mode (auto-restart on changes), use:
```bash
npm run test:watch
```

### 2. Run Test Coverage
To check test coverage, use:
```bash
npm run coverage
```

## Project Structure

```bash
frontend
├── /src/App.js              # Main component file
├── /src/components          # Folder containing all components used by App.js
├── /src/hooks               # Folder containing custom hooks
└── /src/__tests__/          # Folder containing all test files
```
