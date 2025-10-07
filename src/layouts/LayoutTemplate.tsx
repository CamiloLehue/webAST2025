import { Outlet, useLocation } from "react-router";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import { useScrollToTopInstant } from "../hooks/useScrollToTop";
import { PageTransition } from "../components/transitions/PageTransition";
import { AnimatePresence } from "motion/react";
import { useReducedMotion } from "../hooks/useReducedMotion";

function LayoutTemplate() {
  useScrollToTopInstant();
  const location = useLocation();
  const { shouldReduceMotion } = useReducedMotion();

  return (
    <div className="relative w-full min-h-screen h-full flex flex-col justify-between items-center overflow-x-hidden">
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
