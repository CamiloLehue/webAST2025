import { motion, useScroll, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";

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
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y }}
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
  const variants = {
    hidden: {
      opacity: 0,
      x: direction === 'left' ? -60 : direction === 'right' ? 60 : 0,
      y: direction === 'up' ? 60 : direction === 'down' ? -60 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
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
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const counter = useTransform(scrollYProgress, [0, 0.5], [from, to]);

  return (
    <motion.div ref={ref} className={className}>
      <motion.span>
        {counter}
      </motion.span>
    </motion.div>
  );
};