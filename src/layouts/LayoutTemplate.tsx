import { Outlet } from "react-router";
import Header from "./header/Header";
import Footer from "./footer/Footer";

function LayoutTemplate() {
  return (
    <div className="relative w-full min-h-screen h-full flex flex-col justify-between items-center">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default LayoutTemplate;
