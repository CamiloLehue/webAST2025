import { Outlet, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import { useScrollToTopInstant } from "../hooks/useScrollToTop";
import { PageTransition } from "../components/transitions/PageTransition";
import { useReducedMotion } from "../hooks/useReducedMotion";

function LayoutTemplate() {
  useScrollToTopInstant();
  const location = useLocation();
  const { shouldReduceMotion } = useReducedMotion();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Loading inicial - espera a que todo cargue realmente
  useEffect(() => {
    if (isInitialLoad) {
      // Simular progreso mientras carga
      const progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);

      // Verificar si el documento ya está completamente cargado
      if (document.readyState === "complete") {
        setLoadingProgress(100);
        // Si ya está cargado, esperar un mínimo de 800ms para mostrar el logo
        const minDelay = setTimeout(() => {
          setIsLoading(false);
          setIsInitialLoad(false);
        }, 800);
        return () => {
          clearTimeout(minDelay);
          clearInterval(progressInterval);
        };
      }

      // Si no está cargado, esperar al evento load
      const handleLoad = () => {
        setLoadingProgress(100);
        // Pequeño delay adicional para asegurar que todo se renderizó
        setTimeout(() => {
          setIsLoading(false);
          setIsInitialLoad(false);
        }, 300);
      };

      window.addEventListener("load", handleLoad);

      // Timeout de seguridad: máximo 5 segundos de loading
      const maxTimeout = setTimeout(() => {
        setLoadingProgress(100);
        setIsLoading(false);
        setIsInitialLoad(false);
      }, 5000);

      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(maxTimeout);
        clearInterval(progressInterval);
      };
    }
  }, [isInitialLoad]);

  // Loading al cambiar de página
  useEffect(() => {
    if (!isInitialLoad) {
      setIsLoading(true);

      // Esperar a que React termine de renderizar
      const timer = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Mínimo 500ms para mostrar el loading
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        });
      });

      return () => cancelAnimationFrame(timer);
    }
  }, [location.pathname, isInitialLoad]);

  return (
    <div className="relative w-full min-h-screen h-full flex flex-col justify-between items-center overflow-x-hidden">
      <div className="absolute -z-5 left-0 top-0 w-full h-35 bg-bg-400"></div>

      {/* Loading Screen con animación */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed z-[9999] bg-bg-400 left-0 top-0 h-screen flex justify-center items-center w-full overflow-hidden"
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
              {isInitialLoad && (
                <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary-100"
                    initial={{ width: "0%" }}
                    animate={{ width: `${loadingProgress}%` }}
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
                {isInitialLoad
                  ? `Cargando... ${Math.round(loadingProgress)}%`
                  : "Cargando..."}
              </motion.small>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Header />

      {shouldReduceMotion ? (
        // Sin AnimatePresence ni transiciones en móviles
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      ) : (
        // Con AnimatePresence y transiciones en desktop
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      )}
      <Footer />
    </div>
  );
}

export default LayoutTemplate;
