import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdir } from 'fs/promises';
import corsMiddleware from './middleware/cors.js';
import authRoutes from './routes/auth.js';
import contractRoutes from './routes/contracts.js';
import organizationRoutes from './routes/organizations.js';
import { initializeDatabase } from './database/init.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure required directories exist
await mkdir(join(__dirname, 'database'), { recursive: true });
await mkdir(join(__dirname, 'uploads'), { recursive: true });

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

// Apply CORS middleware
app.use(corsMiddleware);

// Middleware
app.use(express.json());
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Initialize database
await initializeDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/organizations', organizationRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});