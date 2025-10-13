import { Outlet, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import { useScrollToTopInstant } from "../hooks/useScrollToTop";
import { PageTransition } from "../components/transitions/PageTransition";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { LoadingScreen } from "../components/loading";

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
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoading]);

  useEffect(() => {
    if (isInitialLoad) {
      const progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);

      if (document.readyState === "complete") {
        setLoadingProgress(100);
        const minDelay = setTimeout(() => {
          setIsLoading(false);
          setIsInitialLoad(false);
        }, 800);
        return () => {
          clearTimeout(minDelay);
          clearInterval(progressInterval);
        };
      }

      const handleLoad = () => {
        setLoadingProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          setIsInitialLoad(false);
        }, 300);
      };

      window.addEventListener("load", handleLoad);

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

  useEffect(() => {
    if (!isInitialLoad) {
      setIsLoading(true);

      // Observador para el atributo data-dynamic-page-loading
      const checkDynamicPageLoading = () => {
        const isDynamicPageLoading = document.body.getAttribute('data-dynamic-page-loading') === 'true';
        
        if (!isDynamicPageLoading) {
          // Pequeño delay para asegurar que el contenido esté renderizado
          setTimeout(() => {
            setIsLoading(false);
          }, 200);
        }
      };

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-dynamic-page-loading') {
            checkDynamicPageLoading();
          }
        });
      });

      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['data-dynamic-page-loading']
      });

      const maxTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 3000);

      const initialCheck = setTimeout(checkDynamicPageLoading, 100);

      return () => {
        observer.disconnect();
        clearTimeout(maxTimeout);
        clearTimeout(initialCheck);
      };
    }
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
