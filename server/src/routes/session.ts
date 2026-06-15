import { Router, type Request, type Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Session } from '../db/models/Session.js';

const router = Router();

//POST /api/session
//Creates a new session and returns its ID.
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const sessionId = req.body.sessionId || uuidv4();

    try {
      await Session.create({
        sessionId,
        chatHistory: [],
        currentCart: [],
        deliveryLocation: {},
        discussedItems: [],
      });
    } catch {
    }

    res.json({ sessionId });
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

//GET /api/session/:id
//Returns the session state (cart, delivery info, etc.)
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await Session.findOne({ sessionId: req.params.id });

    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    res.json({
      sessionId: session.sessionId,
      currentCart: session.currentCart,
      deliveryLocation: session.deliveryLocation,
      discussedItems: session.discussedItems,
      createdAt: session.createdAt,
    });
  } catch (error) {
    console.error('Session fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

export default router;
