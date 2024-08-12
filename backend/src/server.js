import express from 'express';
import cors from 'cors';
import noteRoutes from './routes/noteRoutes.js'; // Import your routes
import swaggerDocs from './swagger.js'

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api/notes', noteRoutes); // Use your notes routes

swaggerDocs(app, PORT);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
