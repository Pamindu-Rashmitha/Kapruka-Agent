import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Cake, Flower2, Heart, Sparkles, PartyPopper, Baby, Star } from 'lucide-react';

interface SuggestionCarouselProps {
  onPromptClick: (prompt: string) => void;
  visible: boolean;
}

const suggestions = [
  { icon: Cake, text: "Birthday Decorations", color: "text-pink-400", bg: "bg-pink-500/10" },
  { icon: Flower2, text: "Send a bouquet to Colombo", color: "text-rose-400", bg: "bg-rose-500/10" },
  { icon: Gift, text: "Anniversary gift ideas", color: "text-purple-400", bg: "bg-purple-500/10" },
  { icon: Heart, text: "Romantic gifts for him", color: "text-red-400", bg: "bg-red-500/10" },
  { icon: Sparkles, text: "Luxury hampers", color: "text-amber-400", bg: "bg-amber-500/10" },
  { icon: PartyPopper, text: "Birthday surprise gifts", color: "text-orange-400", bg: "bg-orange-500/10" },
  { icon: Baby, text: "New baby gift sets", color: "text-sky-400", bg: "bg-sky-500/10" },
  { icon: Star, text: "Best sellers this week", color: "text-yellow-400", bg: "bg-yellow-500/10" },
];

export function SuggestionCarousel({ onPromptClick, visible }: SuggestionCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener('scroll', updateScrollState);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16, transition: { duration: 0.15 } }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl mx-auto"
        >
          {/* Left fade edge */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-10 z-10 pointer-events-none transition-opacity duration-300 bg-gradient-to-r from-surface to-transparent ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Right fade edge */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-10 z-10 pointer-events-none transition-opacity duration-300 bg-gradient-to-l from-surface to-transparent ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex gap-1.5 sm:gap-2 overflow-x-auto carousel-scrollbar px-1 pt-2 pb-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {suggestions.map((s, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.9, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.05 * i + 0.1, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onPromptClick(s.text)}
                className="suggestion-chip group flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full
                  bg-black/[0.04] dark:bg-white/[0.06]
                  border border-black/[0.06] dark:border-white/[0.08]
                  hover:bg-black/[0.08] dark:hover:bg-white/[0.12]
                  hover:border-black/[0.12] dark:hover:border-white/[0.15]
                  hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5
                  active:scale-95
                  transition-all duration-200 cursor-pointer"
              >
                <span className={`${s.color} ${s.bg} p-1 sm:p-1.5 rounded-full transition-transform duration-200 group-hover:scale-110`}>
                  <s.icon size={14} strokeWidth={2.5} />
                </span>
                <span className="text-[12px] sm:text-[13px] font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {s.text}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
