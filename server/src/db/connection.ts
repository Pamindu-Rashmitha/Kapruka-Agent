import mongoose from 'mongoose';
import { env } from '../config/env.js';
import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  if (!env.MONGODB_URI) {
    console.warn('MONGODB_URI not set — running without database persistence.');
    return;
  }

  try {
    await mongoose.connect(env.MONGODB_URI, {
      dbName: 'kapruka-agent',
    });
    isConnected = true;
    console.log('Connected to MongoDB Atlas');

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      console.warn('MongoDB disconnected');
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    console.warn('Server will continue without persistence.');
  }
}
