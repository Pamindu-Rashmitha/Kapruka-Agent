import { motion } from 'framer-motion';

export function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center max-w-2xl mx-auto pt-6 sm:pt-10 pb-28 sm:pb-20">

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-xl sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 tracking-tight text-gray-900 dark:text-white"
      >
        Hi, I'm <span className="text-gradient">Kapru</span>.
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-600 dark:text-gray-400 text-base sm:text-base mb-6 sm:mb-10 max-w-md"
      >
        Your personal gifting concierge for Sri Lanka. What occasion are we celebrating today?
      </motion.p>
    </div>
  );
}
