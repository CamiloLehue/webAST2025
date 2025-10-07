import { useBreakpoints } from "../context/ProviderBreakpoints";
import type { Variants, Transition } from "motion/react";
import { ANIMATION_CONFIG } from "../constants/animationConfig";

export const useReducedMotion = () => {
  const { isSmallDevice } = useBreakpoints();
  
  // Deshabilitar animaciones en dispositivos móviles según configuración
  const shouldReduceMotion = isSmallDevice && ANIMATION_CONFIG.mobile.disableAnimations;
  
  return {
    shouldReduceMotion,
    isSmallDevice,
    config: ANIMATION_CONFIG,
  };
};

// Función helper para crear variantes condicionales
export const createConditionalVariants = (variants: Variants, shouldReduceMotion: boolean): Variants => {
  if (shouldReduceMotion) {
    // Si debemos reducir el movimiento, retornamos variantes sin animación
    return {
      hidden: { opacity: 1 },
      visible: { opacity: 1 }
    };
  }
  return variants;
};

// Función helper para crear transiciones condicionales
export const createConditionalTransition = (transition: Transition, shouldReduceMotion: boolean): Transition => {
  if (shouldReduceMotion) {
    return { duration: ANIMATION_CONFIG.durations.disabled };
  }
  return transition;
};

// Función helper para crear props de animación condicionales
export const createConditionalMotionProps = (
  initial: Variants["hidden"],
  animate: Variants["visible"], 
  transition: Transition,
  shouldReduceMotion: boolean
) => ({
  initial: shouldReduceMotion ? undefined : initial,
  animate: shouldReduceMotion ? undefined : animate,
  transition: shouldReduceMotion ? { duration: ANIMATION_CONFIG.durations.disabled } : transition,
});