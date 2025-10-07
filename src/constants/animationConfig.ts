// Configuración global para animaciones
export const ANIMATION_CONFIG = {
  // Duraciones en segundos
  durations: {
    fast: 0.2,
    normal: 0.5,
    slow: 0.8,
    disabled: 0.001, // Para dispositivos móviles
  },
  
  // Easing presets
  easing: {
    smooth: [0.25, 0.1, 0.25, 1],
    bounce: "easeOut",
    spring: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
  
  // Configuración de viewport para intersección
  viewport: {
    once: true,
    amount: 0.1,
    margin: "0px 0px -100px 0px",
  },
  
  // Configuración específica para móviles
  mobile: {
    disableAnimations: true,
    disableTransitions: true,
    disableParallax: true,
    disableScrollAnimations: true,
  },
} as const;

// Tipos para TypeScript
export type AnimationDuration = keyof typeof ANIMATION_CONFIG.durations;
export type AnimationEasing = keyof typeof ANIMATION_CONFIG.easing;