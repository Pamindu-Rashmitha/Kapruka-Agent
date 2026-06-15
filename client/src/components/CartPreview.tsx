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
      {/* Floating Cart Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed top-6 right-6 z-40 bg-surface/80 backdrop-blur-xl border border-white/10 shadow-2xl p-3 rounded-full text-white flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <div className="relative">
              <ShoppingBag size={24} />
              {itemCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-accent text-brand-deep text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-surface">
                  {itemCount}
                </div>
              )}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cart Drawer/Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-surface/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShoppingBag size={20} className="text-primary" />
                  Your Cart
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                    <ShoppingBag size={48} className="text-white/10 mb-4" />
                    <p className="text-gray-400 text-sm">Your cart is empty</p>
                    <p className="text-gray-500 text-xs mt-1">Ask Kapru to find something for you!</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.productId} className="flex gap-4 p-4 glass-panel bg-white/5">
                      <div className="w-20 h-20 rounded-xl bg-black/30 overflow-hidden flex-shrink-0">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">No image</div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-sm font-medium text-gray-200 line-clamp-2 leading-tight">{item.name}</h3>
                        <div className="mt-1 font-bold text-accent text-sm">
                          LKR {item.price.toLocaleString()}
                        </div>

                        <div className="mt-auto flex items-center gap-3 pt-2">
                          <div className="flex items-center bg-black/40 rounded-lg border border-white/10">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="p-1.5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors rounded-l-lg"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="p-1.5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors rounded-r-lg"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 border-t border-white/10 bg-black/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-xl font-bold text-white">LKR {totalLkr.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)} // Close cart, let the user tell the AI to checkout
                  className="w-full py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  Continue in Chat
                </button>
                <p className="text-xs text-center text-gray-500 mt-3">
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
