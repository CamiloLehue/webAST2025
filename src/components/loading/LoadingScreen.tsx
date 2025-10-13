import { motion, AnimatePresence } from "motion/react";

interface LoadingScreenProps {
  isVisible: boolean;
  progress?: number;
  showProgress?: boolean;
  message?: string;
}

function LoadingScreen({
  isVisible,
  progress = 0,
  showProgress = false,
  message = "Cargando...",
}: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed z-[9999] bg-bg-400 left-0 top-0 h-screen w-screen flex justify-center items-center overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col justify-center gap-5 items-center"
          >
            <motion.img
              src="/AST-Logo-white.png"
              alt="Logo"
              className="w-40"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Barra de progreso */}
            {showProgress && (
              <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary-100"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            )}

            <motion.small
              className="text-white"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {showProgress ? `${message} ${Math.round(progress)}%` : message}
            </motion.small>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoadingScreen;
