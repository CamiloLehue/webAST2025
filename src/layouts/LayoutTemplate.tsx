import { Outlet } from "react-router";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import { useScrollToTopInstant } from "../hooks/useScrollToTop";

function LayoutTemplate() {
  useScrollToTopInstant();

  return (
    <div className="relative w-full min-h-screen h-full flex flex-col justify-between items-center overflow-x-hidden">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default LayoutTemplate;
