import { motion } from "motion/react";
import { type ReactNode } from "react";
import type { Variants } from "motion/react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
};

const pageTransition = {
  type: "tween" as const,
  ease: "easeInOut" as const,
  duration: 0.5
};

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export const PageTransition = ({ children, className = "" }: PageTransitionProps) => {
  const { shouldReduceMotion } = useReducedMotion();
  
  const conditionalVariants: Variants = shouldReduceMotion ? {
    initial: { opacity: 1 },
    in: { opacity: 1 },
    out: { opacity: 1 }
  } : pageVariants;
  
  const conditionalTransition = shouldReduceMotion ? { duration: 0 } : pageTransition;

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="in"
      exit="out"
      variants={conditionalVariants}
      transition={conditionalTransition}
    >
      {children}
    </motion.div>
  );
};