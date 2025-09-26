import { useScroll, useTransform, MotionValue } from "motion/react";
import { useRef, type RefObject } from "react";

// Hook para crear efectos parallax
export const useParallax = (offset: number = 50): [RefObject<HTMLElement | null>, MotionValue<number>] => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return [ref, y];
};

// Hook para animaciones de scroll con diferentes easing
export const useScrollAnimation = () => {
  const { scrollY } = useScroll();

  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const y = useTransform(scrollY, [0, 300], [0, -50]);

  return { opacity, scale, y };
};

// Hook para crear contadores animados basados en scroll
export const useScrollCounter = (
  from: number, 
  to: number
): [RefObject<HTMLElement | null>, MotionValue<number>] => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const counter = useTransform(scrollYProgress, [0, 1], [from, to]);

  return [ref, counter];
};

// Hook para crear animaciones de entrada staggered
export const useStaggerAnimation = (staggerDelay: number = 0.1) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  return { containerVariants, itemVariants };
};