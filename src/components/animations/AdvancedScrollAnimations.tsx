import { motion, useScroll, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  offset?: number;
}

export const ParallaxSection = ({ 
  children, 
  className = "", 
  offset = 50 
}: ParallaxSectionProps) => {
  const { shouldReduceMotion } = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [shouldReduceMotion ? 0 : offset, shouldReduceMotion ? 0 : -offset]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y: shouldReduceMotion ? 0 : y }}
    >
      {children}
    </motion.div>
  );
};

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}

export const ScrollReveal = ({ 
  children, 
  className = "", 
  direction = 'up',
  delay = 0 
}: ScrollRevealProps) => {
  const { shouldReduceMotion } = useReducedMotion();
  
  const variants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      x: shouldReduceMotion ? 0 : (direction === 'left' ? -60 : direction === 'right' ? 60 : 0),
      y: shouldReduceMotion ? 0 : (direction === 'up' ? 60 : direction === 'down' ? -60 : 0),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        delay: shouldReduceMotion ? 0 : delay,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial={shouldReduceMotion ? undefined : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

interface CounterAnimationProps {
  from: number;
  to: number;
  className?: string;
}

export const CounterAnimation = ({ 
  from, 
  to, 
  className = "" 
}: CounterAnimationProps) => {
  const { shouldReduceMotion } = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const counter = useTransform(scrollYProgress, [0, 0.5], [shouldReduceMotion ? to : from, to]);

  return (
    <motion.div ref={ref} className={className}>
      <motion.span>
        {shouldReduceMotion ? to : counter}
      </motion.span>
    </motion.div>
  );
};