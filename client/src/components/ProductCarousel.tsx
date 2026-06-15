import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { Product } from '../types';

interface ProductCarouselProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductCarousel({ products, onAddToCart }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  });
  
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (!products || products.length === 0) return null;

  return (
    <div className="relative w-full py-2 my-4">
      {/* Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 px-1" style={{ touchAction: 'pan-y pinch-zoom' }}>
          {products.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="flex-[0_0_85%] sm:flex-[0_0_240px] md:flex-[0_0_260px] lg:flex-[0_0_280px] min-w-0" // Responsive widths, allowing peeking on smaller screens
            >
              <ProductCard product={product} onAdd={onAddToCart} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons (Desktop only, hidden on touch devices ideally) */}
      <div className="hidden md:block">
        <button
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
          className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface/80 border border-white/10 flex items-center justify-center text-white backdrop-blur-md shadow-lg disabled:opacity-0 transition-all z-10"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
          className="absolute right-[-16px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface/80 border border-white/10 flex items-center justify-center text-white backdrop-blur-md shadow-lg disabled:opacity-0 transition-all z-10"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
