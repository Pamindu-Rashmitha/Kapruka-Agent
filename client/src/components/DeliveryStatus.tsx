import { motion } from 'framer-motion';
import { Truck, MapPin, Calendar, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import type { DeliveryInfo } from '../types';

interface DeliveryStatusProps {
  info: DeliveryInfo;
}

export function DeliveryStatus({ info }: DeliveryStatusProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel w-full max-w-sm overflow-hidden bg-gradient-to-br from-surface to-black/80 border border-white/10"
    >
      <div className={`p-4 border-b flex items-center gap-3 ${
        info.available ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
      }`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg ${
          info.available ? 'bg-green-500 shadow-green-500/30' : 'bg-red-500 shadow-red-500/30'
        }`}>
          {info.available ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
        </div>
        <div>
          <h3 className="font-bold text-white text-base">
            {info.available ? 'Delivery Available' : 'Delivery Unavailable'}
          </h3>
          <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
            <MapPin size={12} />
            {info.city}
          </p>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        {info.date && (
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary border border-white/5">
              <Calendar size={16} />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-0.5">Scheduled Date</div>
              <div className="font-medium">{info.date}</div>
            </div>
          </div>
        )}
        
        {info.rate_lkr !== undefined && info.available && (
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-secondary border border-white/5">
              <Truck size={16} />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-0.5">Delivery Charge</div>
              <div className="font-medium text-white">LKR {info.rate_lkr.toLocaleString()}</div>
            </div>
          </div>
        )}

        {info.perishable_warning && (
          <div className="mt-3 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs flex items-start gap-2 leading-relaxed">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span>This order contains perishable items (cakes/flowers) which may require special handling or specific delivery times.</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
