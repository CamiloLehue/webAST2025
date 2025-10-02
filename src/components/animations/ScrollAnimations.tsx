import { motion } from "motion/react";
import { type ReactNode } from "react";
import type { Variants } from "motion/react";

// Variantes de animación para diferentes efectos
const fadeInVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const slideInLeftVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -100 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const slideInRightVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: 100 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const scaleUpVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};

const staggerItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

// Componentes wrapper para animaciones
interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
}

export const FadeInSection = ({ 
  children, 
  className = "", 
  variants = fadeInVariants,
  delay = 0 
}: AnimatedSectionProps) => (
  <motion.div
    className={className}
    variants={variants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
    transition={{ delay }}
  >
    {children}
  </motion.div>
);

export const SlideInLeft = ({ 
  children, 
  className = "", 
  delay = 0 
}: AnimatedSectionProps) => (
  <motion.div
    className={className}
    variants={slideInLeftVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
    transition={{ delay }}
  >
    {children}
  </motion.div>
);

export const SlideInRight = ({ 
  children, 
  className = "", 
  delay = 0 
}: AnimatedSectionProps) => (
  <motion.div
    className={className}
    variants={slideInRightVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
    transition={{ delay }}
  >
    {children}
  </motion.div>
);

export const ScaleUpSection = ({ 
  children, 
  className = "", 
  delay = 0 
}: AnimatedSectionProps) => (
  <motion.div
    className={className}
    variants={scaleUpVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }}
    transition={{ delay }}
  >
    {children}
  </motion.div>
);

export const StaggerContainer = ({ 
  children, 
  className = "" 
}: AnimatedSectionProps) => (
  <motion.div
    className={className}
    variants={staggerContainerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.05, margin: "0px 0px -150px 0px" }}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ 
  children, 
  className = "" 
}: AnimatedSectionProps) => (
  <motion.div
    className={className}
    variants={staggerItemVariants}
  >
    {children}
  </motion.div>
);