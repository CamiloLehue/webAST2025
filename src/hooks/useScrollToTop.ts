import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useBreakpoints } from "../context/ProviderBreakpoints";

export const useScrollToTop = () => {
  const { pathname } = useLocation();
  const { isSmallDevice } = useBreakpoints();

  useEffect(() => {
    if (isSmallDevice) {
      // En móviles, scroll instantáneo para mejor rendimiento
      window.scrollTo(0, 0);
    } else {
      // En desktop, scroll suave
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [pathname, isSmallDevice]);
};


export const useScrollToTopInstant = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};


export const useScrollToTopDelayed = (delay: number = 100) => {
  const { pathname } = useLocation();
  const { isSmallDevice } = useBreakpoints();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isSmallDevice) {
        // En móviles, scroll instantáneo
        window.scrollTo(0, 0);
      } else {
        // En desktop, scroll suave
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [pathname, delay, isSmallDevice]);
};
