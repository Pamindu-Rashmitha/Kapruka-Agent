import express from 'express';
import cors from 'cors';
import { env, validateEnv } from './config/env.js';
import { connectDB } from './db/connection.js';
import { getMcpClient, closeMcpClient } from './mcp/client.js';
import chatRouter from './routes/chat.js';
import sessionRouter from './routes/session.js';

validateEnv();

const app = express();

// Middleware
app.use(cors({ origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api/chat', chatRouter);
app.use('/api/session', sessionRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
async function start() {
  // Connect to MongoDB
  await connectDB();

  // Pre-warm the MCP client connection
  try {
    await getMcpClient();
  } catch (error) {
    console.error('MCP client failed to connect on startup:', error);
    console.warn('Will retry on first chat request.');
  }

  app.listen(env.PORT, () => {
    console.log(`\nKapruka Shopping Agent server running on http://localhost:${env.PORT}`);
    console.log(`Chat endpoint: POST http://localhost:${env.PORT}/api/chat`);
    console.log(`Health check:  GET  http://localhost:${env.PORT}/api/health\n`);
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  await closeMcpClient();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeMcpClient();
  process.exit(0);
});

start().catch(console.error);
