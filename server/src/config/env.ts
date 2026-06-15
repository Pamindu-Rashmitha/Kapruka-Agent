import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  MONGODB_URI: process.env.MONGODB_URI || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  MCP_ENDPOINT: process.env.MCP_ENDPOINT || 'https://mcp.kapruka.com/mcp',
} as const;

// Validate required env vars at startup
export function validateEnv(): void {
  const missing: string[] = [];

  if (!env.OPENAI_API_KEY || env.OPENAI_API_KEY === 'sk-your-key-here') {
    missing.push('OPENAI_API_KEY');
  }
  if (!env.MONGODB_URI || env.MONGODB_URI.includes('user:pass')) {
    missing.push('MONGODB_URI');
  }

  if (missing.length > 0) {
    console.warn(
      `Missing or placeholder environment variables: ${missing.join(', ')}\n` +
      `Copy .env.example to .env and fill in your values.`
    );
  }
}
