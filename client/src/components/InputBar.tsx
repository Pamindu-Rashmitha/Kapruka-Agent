import React, { useRef, useEffect } from 'react';
import { SendHorizonal, Loader2, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputBarProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: () => void;
  isLoading: boolean;
  stop: () => void;
}

export function InputBar({ input, setInput, handleSubmit, isLoading, stop }: InputBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit();
      }
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) {
      stop();
    } else {
      handleSubmit();
    }
  };

  return (
    <div className="p-4 bg-gradient-to-t from-surface via-surface/95 to-transparent pt-10">
      <div className="max-w-3xl mx-auto relative">
        <form
          onSubmit={onFormSubmit}
          className="relative flex items-end gap-2 glass-input p-1.5 pl-4 shadow-xl"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask Kapru for gift ideas..."
            className="flex-grow bg-transparent text-white placeholder-gray-400 py-3 resize-none max-h-[120px] focus:outline-none scrollbar-hide text-base leading-relaxed"
            rows={1}
            disabled={false}
          />

          <button
            type="submit"
            disabled={!isLoading && !input.trim()}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-primary text-white disabled:opacity-50 disabled:bg-white/10 transition-colors mb-0.5 mr-0.5"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Square size={14} fill="currentColor" />
                </motion.div>
              ) : (
                <motion.div
                  key="send"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <SendHorizonal size={18} className="ml-0.5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </form>
        <div className="text-center mt-2">
          <p className="text-[10px] text-gray-500 font-medium tracking-wide">
            POWERED BY KAPRUKA MCP
          </p>
        </div>
      </div>
    </div>
  );
}
