import { motion } from "motion/react";
import { type ReactNode } from "react";
import type { Variants } from "motion/react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const simpleFadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const subtleSlideVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.25, 0.46, 0.45, 0.94] // Ease-out más suave
    }
  }
};

const staggerContainerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animate?: boolean;
}

export const FadeInSection = ({ 
  children, 
  className = "", 
  delay = 0,
  animate = false
}: AnimatedSectionProps) => {
  const { shouldReduceMotion } = useReducedMotion();
  
  if (!animate || shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      {children}
    </motion.div>
  );
};

export const SlideInLeft = ({ 
  children, 
  className = "",
  animate = false
}: AnimatedSectionProps) => {
  const { shouldReduceMotion } = useReducedMotion();
  
  if (!animate || shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <motion.div
      className={className}
      variants={subtleSlideVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ 
        once: true, 
        amount: 0.3,
        margin: "0px 0px -100px 0px" // Se activa antes de que esté completamente visible
      }}
    >
      {children}
    </motion.div>
  );
};

export const SlideInRight = ({ 
  children, 
  className = "",
  animate = false
}: AnimatedSectionProps) => {
  const { shouldReduceMotion } = useReducedMotion();
  
  if (!animate || shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <motion.div
      className={className}
      variants={subtleSlideVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ 
        once: true, 
        amount: 0.3,
        margin: "0px 0px -100px 0px" // Se activa antes de que esté completamente visible
      }}
    >
      {children}
    </motion.div>
  );
};

export const ScaleUpSection = ({ 
  children, 
  className = "",
  animate = false
}: AnimatedSectionProps) => {
  const { shouldReduceMotion } = useReducedMotion();
  
  if (!animate || shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <motion.div
      className={className}
      variants={simpleFadeVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({ 
  children, 
  className = "",
  animate = false
}: AnimatedSectionProps) => {
  const { shouldReduceMotion } = useReducedMotion();
  
  if (!animate || shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <motion.div
      className={className}
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ 
  children, 
  className = "" 
}: AnimatedSectionProps) => {
  return (
    <motion.div
      className={className}
      variants={staggerItemVariants}
    >
      {children}
    </motion.div>
  );
};
