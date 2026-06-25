import { motion } from 'framer-motion';
import { Gift, Cake, Flower2, Heart } from 'lucide-react';

interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void;
}

export function WelcomeScreen({ onPromptClick }: WelcomeScreenProps) {
  const suggestions = [
    { icon: Cake, text: "Cakes under LKR 5000", color: "text-pink-400" },
    { icon: Flower2, text: "Send a bouquet to Colombo", color: "text-rose-400" },
    { icon: Gift, text: "Anniversary gift ideas", color: "text-purple-400" },
    { icon: Heart, text: "Romantic gifts for him", color: "text-red-400" }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center max-w-2xl mx-auto pt-10 pb-20">

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-4xl font-bold mb-3 tracking-tight text-gray-900 dark:text-white"
      >
        Hi, I'm <span className="text-gradient">Kapru</span>.
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-600 dark:text-gray-400 text-lg mb-10 max-w-md"
      >
        Your personal gifting concierge for Sri Lanka. What occasion are we celebrating today?
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg"
      >
        {suggestions.map((s, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPromptClick(s.text)}
            className="flex items-center gap-3 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-left transition-colors hover:bg-black/10 dark:hover:bg-white/10"
          >
            <div className={`p-2 rounded-full bg-black/5 dark:bg-white/5 ${s.color}`}>
              <s.icon size={18} />
            </div>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{s.text}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
