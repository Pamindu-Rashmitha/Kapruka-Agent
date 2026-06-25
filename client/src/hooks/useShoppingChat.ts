import { useState, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { CartItem } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

function getOrCreateSessionId() {
  const stored = localStorage.getItem('kapru_session_id');
  if (stored) return stored;
  const newId = crypto.randomUUID();
  localStorage.setItem('kapru_session_id', newId);
  return newId;
}

export function useShoppingChat() {
  const [sessionId, setSessionId] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isServerReady, setIsServerReady] = useState(false);

  useEffect(() => {
    const id = getOrCreateSessionId();
    setSessionId(id);

    // Attempt to fetch existing session state from server
    fetch(`${API_BASE}/api/session/${id}`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Session not found');
      })
      .then(data => {
        if (data.currentCart) setCart(data.currentCart);
      })
      .catch(() => {
        // Create new session if it doesn't exist
        fetch(`${API_BASE}/api/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: id })
        }).catch(console.error);
      })
      .finally(() => setIsServerReady(true));
  }, []);

  const chat = useChat({
    transport: new DefaultChatTransport({
      api: `${API_BASE}/api/chat`,
      body: { sessionId },
    }),
    onError: (err) => {
      console.error('Chat error:', err);
    },
  });

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      if (existing) {
        return prev.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    // Send an invisible message to update the server's context
    chat.sendMessage({ text: `I just added ${item.name} to my cart.` });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart(prev => {
      if (quantity <= 0) return prev.filter(i => i.productId !== productId);
      return prev.map(i => i.productId === productId ? { ...i, quantity } : i);
    });
    chat.sendMessage({ text: `I updated the quantity of product ${productId} in my cart to ${quantity}.` });
  };

  return {
    ...chat,
    sessionId,
    isServerReady,
    cart,
    addToCart,
    updateCartQuantity,
  };
}
