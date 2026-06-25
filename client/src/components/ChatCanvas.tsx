import { useEffect, useRef, useState } from 'react';
import { useShoppingChat } from '../hooks/useShoppingChat';
import { WelcomeScreen } from './WelcomeScreen';
import { MessageBubble } from './MessageBubble';
import { InputBar } from './InputBar';
import { TypingIndicator } from './TypingIndicator';
import { CartPreview } from './CartPreview';
import { Loader2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function ChatCanvas() {
  const [input, setInput] = useState('');
  const {
    messages,
    sendMessage,
    status,
    isServerReady,
    cart,
    addToCart,
    updateCartQuantity,
    stop,
  } = useShoppingChat();

  const isLoading = status === 'submitted' || status === 'streaming';
  const [isCartOpen, setIsCartOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInput('');
  };

  const handlePromptClick = (prompt: string) => {
    sendMessage({ text: prompt });
  };

  if (!isServerReady) {
    return (
      <div className="h-dvh w-full flex flex-col items-center justify-center bg-surface text-gray-900 dark:text-white transition-colors duration-300">
        <Loader2 size={32} className="animate-spin text-primary mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Connecting to Kapruka MCP...</p>
      </div>
    );
  }

  // Filter out invisible cart-sync messages
  const visibleMessages = messages.filter(m =>
    !(m.role === 'user' && m.parts.some(
      p => p.type === 'text' && (
        p.text.startsWith('I just added') ||
        p.text.startsWith('I updated the quantity')
      )
    ))
  );

  return (
    <div className="h-dvh w-full flex flex-col relative overflow-hidden bg-surface transition-colors duration-300">
      <div className="absolute top-4 left-4 z-50">
        <ThemeToggle />
      </div>

      <CartPreview
        cart={cart}
        isOpen={isCartOpen}
        setIsOpen={setIsCartOpen}
        updateQuantity={updateCartQuantity}
      />

      {/* Main chat area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar pt-8 pb-32"
      >
        {visibleMessages.length === 0 ? (
          <WelcomeScreen onPromptClick={handlePromptClick} />
        ) : (
          <div className="flex flex-col gap-6 px-4 md:px-8 max-w-5xl mx-auto pb-8">
            {visibleMessages.map(m => (
              <MessageBubble
                key={m.id}
                message={m}
                onAddToCart={(p) => {
                  addToCart({
                    productId: p.id,
                    name: p.name,
                    price: p.price,
                    currency: p.currency,
                    imageUrl: p.imageUrl
                  });
                  setIsCartOpen(true);
                }}
              />
            ))}

            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="max-w-4xl mx-auto w-full px-12">
                <TypingIndicator />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky input bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <InputBar
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          stop={stop}
          itemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          onCartClick={() => setIsCartOpen(true)}
        />
      </div>
    </div>
  );
}
