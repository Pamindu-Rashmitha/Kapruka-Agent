import { Router, type Request, type Response } from 'express';
import { handleChatStream } from '../ai/agent.js';
import { Session } from '../db/models/Session.js';

const router = Router();

/* POST /api/chat
  Accepts { messages, sessionId } from the @ai-sdk/react useChat hook.
  Loads session context from MongoDB (if available), then streams the
  AI response with MCP tool access back to the client */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages, data } = req.body;
    const sessionId = data?.sessionId || req.body.sessionId;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'messages array is required' });
      return;
    }

    // Load session from MongoDB
    let session = null;
    if (sessionId) {
      session = await Session.findOne({ sessionId });
    }

    // Stream the AI response
    await handleChatStream(messages, session, res);
  } catch (error) {
    console.error('Chat route error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error', details: String(error) });
    }
  }
});

export default router;
