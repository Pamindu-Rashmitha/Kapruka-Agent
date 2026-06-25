import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import type { Category } from '../types';

interface CategoryBrowserProps {
  categories: Category[];
  onSelectCategory: (categoryName: string) => void;
}

export function CategoryBrowser({ categories, onSelectCategory }: CategoryBrowserProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full mt-3 flex flex-wrap gap-2">
      {categories.map((cat, index) => (
        <motion.button
          key={cat.id || cat.name}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
          onClick={() => onSelectCategory(cat.name)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-primary/20 hover:border-primary/30 text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors shadow-sm"
        >
          <Tag size={14} className="text-primary" />
          {cat.name}
        </motion.button>
      ))}
    </div>
  );
}
