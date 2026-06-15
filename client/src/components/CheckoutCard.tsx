import { motion } from 'framer-motion';
import { CreditCard, ExternalLink, Clock } from 'lucide-react';
import type { OrderConfirmation } from '../types';

interface CheckoutCardProps {
  order: OrderConfirmation;
}

export function CheckoutCard({ order }: CheckoutCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel w-full max-w-sm overflow-hidden bg-gradient-to-br from-surface to-black border border-primary/30"
    >
      <div className="bg-primary/20 p-4 border-b border-primary/20 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 text-white">
          <CreditCard size={20} />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg">Order Ready</h3>
          <p className="text-primary/80 text-xs font-medium flex items-center gap-1">
            <Clock size={12} />
            Prices locked for {order.expires_in_minutes} mins
          </p>
        </div>
      </div>
      
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center text-sm text-gray-300">
          <span>Items Total</span>
          <span className="font-medium">{order.currency} {order.cart_total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-300 pb-3 border-b border-white/10">
          <span>Delivery</span>
          <span className="font-medium">{order.currency} {order.delivery_charge.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-lg font-bold text-white pt-1">
          <span>Total</span>
          <span className="text-accent">{order.currency} {order.grand_total.toLocaleString()}</span>
        </div>
        
        <div className="pt-4 mt-2">
          <a 
            href={order.checkout_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-accent text-brand-deep font-bold py-3.5 rounded-xl hover:bg-[#e6c907] transition-colors shadow-lg shadow-accent/20"
          >
            Pay Now
            <ExternalLink size={18} />
          </a>
          <p className="text-center text-xs text-gray-500 mt-3 leading-relaxed">
            Secure checkout via Kapruka.<br/>No account required.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
