import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Minus, Plus } from 'lucide-react';
import type { CartItem } from '../types';

interface CartPreviewProps {
  cart: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

export function CartPreview({ cart, isOpen, setIsOpen, updateQuantity }: CartPreviewProps) {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalLkr = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>


      {/* Cart Drawer/Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
            />
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:max-w-md bg-white/90 dark:bg-surface/40 backdrop-blur-3xl border-l border-gray-200 dark:border-white/10 shadow-[[-20px_0_40px_rgba(0,0,0,0.1)]] dark:shadow-[[-20px_0_40px_rgba(0,0,0,0.3)]] z-50 flex flex-col"
            >
              {/* Subtle glass gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 drop-shadow-md">
                  <ShoppingBag size={20} className="text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                  Your Cart
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 custom-scrollbar relative z-10">
                {cart.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex-1 flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="w-24 h-24 mb-6 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.1)] relative">
                      <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse blur-xl" />
                      <ShoppingBag size={40} className="text-gray-400 dark:text-white/40 relative z-10" />
                    </div>
                    <p className="text-gray-800 dark:text-white font-medium mb-1">Your cart is empty</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[200px]">Ask Kapru to find something special for you!</p>
                  </motion.div>
                ) : (
                  cart.map(item => (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-4 p-4 glass-panel bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300 group"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 overflow-hidden flex-shrink-0 relative group-hover:border-gray-300 dark:group-hover:border-white/20 transition-colors">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-white/20 text-[10px] bg-gradient-to-br from-white/5 to-transparent">
                            <ShoppingBag size={16} className="mb-1 opacity-50" />
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 leading-tight">{item.name}</h3>
                        <div className="mt-1 font-bold text-accent text-sm">
                          LKR {item.price.toLocaleString()}
                        </div>

                        <div className="mt-auto flex items-center gap-3 pt-2">
                          <div className="flex items-center bg-gray-100 dark:bg-black/40 rounded-lg border border-gray-200 dark:border-white/10 shadow-inner">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors rounded-l-lg"
                            >
                              <Minus size={14} />
                            </motion.button>
                            <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors rounded-r-lg"
                            >
                              <Plus size={14} />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/40 backdrop-blur-xl relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Subtotal</span>
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 dark:from-white to-gray-600 dark:to-gray-300 drop-shadow-sm">
                    LKR {totalLkr.toLocaleString()}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsOpen(false)} // Close cart, let the user tell the AI to checkout
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] border border-white/20 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Continue in Chat
                  </span>
                </motion.button>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4 font-medium">
                  Tell Kapru when you're ready to checkout!
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
