import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductCarousel } from './ProductCarousel';
import { CheckoutCard } from './CheckoutCard';
import { DeliveryStatus } from './DeliveryStatus';
import { CategoryBrowser } from './CategoryBrowser';
import {
  parseSearchResults,
  parseOrderResult,
  parseDeliveryCheck,
  parseCategories
} from '../lib/toolResultParsers';
import type { UIMessage } from 'ai';
import { isToolUIPart, getToolName } from 'ai';
import type { Product } from '../types';

interface MessageBubbleProps {
  message: UIMessage;
  onAddToCart: (product: Product) => void;
}

export function MessageBubble({ message, onAddToCart }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  // Extract text content from parts
  const textContent = message.parts
    .filter(p => p.type === 'text')
    .map(p => (p as { type: 'text'; text: string }).text)
    .join('');

  // Invisible messages used for state sync
  if (isUser && (textContent.startsWith('I just added') || textContent.startsWith('I updated the quantity'))) {
    return null;
  }

  // Extract tool parts using AI SDK v3 type guard
  const toolParts = message.parts.filter(isToolUIPart);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2 sm:gap-3 max-w-4xl mx-auto w-full ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${isUser
        ? 'bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 text-gray-700 dark:text-white'
        : 'bg-gradient-to-br from-primary to-primary-dark shadow-lg shadow-primary/20 text-white'
        }`}>
        {isUser ? <User size={14} /> : <Gift size={14} />}
      </div>

      {/* Content */}
      <div className={`flex flex-col min-w-0 flex-1 ${isUser ? 'items-end' : 'items-start'}`}>
        {textContent && (
          <div className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-[14px] sm:text-[15px] leading-relaxed shadow-sm max-w-[92%] sm:max-w-[85%] ${isUser
            ? 'bg-primary text-white rounded-tr-sm'
            : 'bg-gray-100 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-100 rounded-tl-sm'
            }`}>
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                a: ({ node, ...props }) => <a className="text-secondary hover:underline font-medium" target="_blank" rel="noopener noreferrer" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900 dark:text-white" {...props} />,
                img: () => null, // Hide inline images to avoid redundancy with tool UI
              }}
            >
              {textContent}
            </ReactMarkdown>
          </div>
        )}

        {/* Generative UI: Tool Invocations & Results */}
        {toolParts.map(part => {
          const toolName = getToolName(part);
          const { toolCallId, state } = part;
          const partKey = `${toolCallId}-${state}`;

          if (state === 'output-available') {
            const output = part.output;
            switch (toolName) {
              case 'kapruka_search_products': {
                const products = parseSearchResults(output);
                if (products.length === 0) {
                  return (
                    <div key={partKey} className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic px-2">
                      No products found.
                    </div>
                  );
                }
                return (
                  <div key={partKey} className="w-full mt-2 -ml-1 sm:-ml-4">
                    <ProductCarousel products={products} onAddToCart={onAddToCart} />
                  </div>
                );
              }
              case 'kapruka_create_order': {
                const order = parseOrderResult(output);
                if (!order) return null;
                return (
                  <div key={partKey} className="w-full mt-2 -ml-1 sm:-ml-4">
                    <CheckoutCard order={order} />
                  </div>
                );
              }
              case 'kapruka_check_delivery': {
                const delivery = parseDeliveryCheck(output);
                if (!delivery) return null;
                return (
                  <div key={partKey} className="w-full mt-2 -ml-1 sm:-ml-4">
                    <DeliveryStatus info={delivery} />
                  </div>
                );
              }
              case 'kapruka_list_categories': {
                const categories = parseCategories(output);
                if (!categories || categories.length === 0) return null;
                return (
                  <div key={partKey} className="w-full mt-2">
                    <CategoryBrowser
                      categories={categories}
                      onSelectCategory={(_catName) => {
                        // Pass down onSendMessage if needed
                      }}
                    />
                  </div>
                );
              }
              default:
                return (
                  <div key={partKey} className="mt-2 text-xs font-mono bg-black/10 dark:bg-black/30 p-2 rounded border border-black/5 dark:border-white/5 text-gray-500 dark:text-gray-400 max-w-full overflow-x-auto hidden">
                    Completed: {toolName}
                  </div>
                );
            }
          }

          if (state === 'input-streaming' || state === 'input-available') {
            return (
              <div key={partKey} className="mt-2 flex items-center gap-2 text-xs font-medium text-primary/80 px-2 animate-pulse">
                <span className="w-1 h-1 rounded-full bg-primary/80" />
                Working on it...
              </div>
            );
          }

          return null;
        })}
      </div>
    </motion.div>
  );
}
