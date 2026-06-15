import { motion } from 'framer-motion';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  // Construct a fallback URL if the API doesn't provide one directly
  const productUrl = product.url || `https://www.kapruka.com/buyonline/${product.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}/kid/${product.id}`;

  return (
    <motion.div 
      whileHover={{ y: -6 }}
      className="glass-panel overflow-hidden flex flex-col h-full bg-white/5 hover:bg-white/[0.08] group relative border border-white/5 hover:border-white/20 transition-colors duration-300 shadow-lg hover:shadow-primary/20 hover:shadow-2xl rounded-2xl"
    >
      <div className="aspect-square w-full relative overflow-hidden bg-black/20">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            No image
          </div>
        )}
        
        {/* Gradient overlay at bottom of image */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface/90 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-80" />
        
        {/* Brand badge */}
        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md text-[10px] uppercase tracking-wider font-semibold text-white/80 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Kapruka
        </div>

        {/* Price badge */}
        <div className="absolute bottom-3 right-3 bg-gradient-to-r from-primary to-primary-dark px-3 py-1.5 rounded-full text-sm font-bold text-white shadow-lg border border-primary-light/30 transform group-hover:scale-105 transition-transform duration-300">
          {product.currency} {product.price.toLocaleString()}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-100 line-clamp-2 leading-snug mb-2 group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`} />
            <span className="font-medium">{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
          </div>
          
          <div className="ml-auto flex items-center gap-2">
            <a 
              href={productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white transition-colors"
              title="View on Kapruka"
            >
              <ExternalLink size={14} />
            </a>

            <button
              onClick={() => onAdd(product)}
              disabled={!product.inStock}
              className="group/btn flex items-center justify-center h-8 px-2.5 rounded-full bg-primary/20 text-primary-light border border-primary/30 hover:bg-primary hover:text-white hover:border-primary-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-sm hover:shadow-primary/40"
              aria-label="Add to cart"
            >
              <ShoppingCart size={15} className="shrink-0" />
              <span className="max-w-0 opacity-0 group-hover/btn:max-w-[80px] group-hover/btn:opacity-100 group-hover/btn:ml-1.5 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out text-xs font-bold tracking-wide">
                ADD
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
