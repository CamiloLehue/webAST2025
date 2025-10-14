import { Outlet, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import { useScrollToTopInstant } from "../hooks/useScrollToTop";
import { PageTransition } from "../components/transitions/PageTransition";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { LoadingScreen } from "../components/loading";
import { subscribeToContentLoading } from "../utils/contentLoadingEvents";

function LayoutTemplate() {
  useScrollToTopInstant();
  const location = useLocation();
  const { shouldReduceMotion } = useReducedMotion();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Bloquear scroll cuando está cargando
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.position = "static";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.position = "static";
    };
  }, [isLoading]);

  // CARGA INICIAL - Esperar a que todo el DOM y recursos estén listos
  useEffect(() => {
    if (!isInitialLoad) return;

    const minLoadingTime = 800; // Tiempo mínimo visible
    const startTime = Date.now();

    // Actualizar progreso visual
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 12;
      });
    }, 150) as unknown as number;

    const completeLoading = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

      clearInterval(progressInterval);
      setLoadingProgress(100);

      setTimeout(() => {
        setIsLoading(false);
        setIsInitialLoad(false);
      }, remainingTime + 300); // +300ms para animación suave
    };

    // Esperar a que el DOM esté completamente cargado
    if (document.readyState === "complete") {
      // Ya está todo cargado
      setTimeout(completeLoading, 200);
    } else {
      // Esperar al evento load
      window.addEventListener("load", completeLoading);
    }

    // Timeout de seguridad (máximo 4 segundos)
    const maxTimeout = setTimeout(completeLoading, 4000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(maxTimeout);
      window.removeEventListener("load", completeLoading);
    };
  }, [isInitialLoad]);

  // ESCUCHAR EVENTOS DE CARGA DE CONTENIDO
  useEffect(() => {
    const unsubscribe = subscribeToContentLoading((isContentLoading) => {
      console.log('[LayoutTemplate] Content loading state:', isContentLoading);
      
      if (isContentLoading) {
        // El contenido empieza a cargar
        setIsLoading(true);
      } else {
        // El contenido terminó de cargar
        // Pequeño delay para asegurar que el DOM se actualizó
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
      }
    });

    return unsubscribe;
  }, []);

  // NAVEGACIÓN - Detectar cambio de ruta (sin controlar loading aquí)
  useEffect(() => {
    if (isInitialLoad) return; // Solo después de la carga inicial
    
    // El loading lo controla el evento de DynamicPage
    console.log('[LayoutTemplate] Route changed to:', location.pathname);
    
  }, [location.pathname, isInitialLoad]);

  return (
    <>
      <LoadingScreen
        isVisible={isLoading}
        progress={loadingProgress}
        showProgress={isInitialLoad}
        message="Cargando..."
      />

      <Header />

      {/* Contenedor principal con fondo y contenido */}
      <div className="relative w-full min-h-screen h-full flex flex-col justify-between items-center overflow-x-hidden">
        <div className="absolute -z-5 left-0 top-0 w-full h-35 bg-bg-400"></div>

        {/* Espaciador para compensar el header fijo */}

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
    </>
  );
}

export default LayoutTemplate;
