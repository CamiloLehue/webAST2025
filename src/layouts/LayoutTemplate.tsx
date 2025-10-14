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

  useEffect(() => {
    if (!isInitialLoad) return;

    const minLoadingTime = 800; 
    const startTime = Date.now();

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
      }, remainingTime + 300); 
    };

    if (document.readyState === "complete") {
      setTimeout(completeLoading, 200);
    } else {
      window.addEventListener("load", completeLoading);
    }

    const maxTimeout = setTimeout(completeLoading, 4000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(maxTimeout);
      window.removeEventListener("load", completeLoading);
    };
  }, [isInitialLoad]);

  useEffect(() => {
    const unsubscribe = subscribeToContentLoading((isContentLoading) => {
      console.log('[LayoutTemplate] Content loading state:', isContentLoading);
      
      if (isContentLoading) {
        setIsLoading(true);
      } else {
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isInitialLoad) return; 
    
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

      <div className="relative  w-full min-h-screen h-full flex flex-col justify-between items-center overflow-x-hidden">
        <div className="absolute -z-5 left-0 top-0 w-full h-35 bg-bg-400"></div>


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
