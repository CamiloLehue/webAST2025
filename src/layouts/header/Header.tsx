import { motion } from "motion/react";
import NavBar from "./NavBar";
import TopHeader from "./TopHeader";

function Header() {
  return (
    <motion.header 
      className="relative w-full z-20 flex flex-col bg-bg-100  text-white-100"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.1
      }}
    >
      <div className="bg-bg-200 w-full">
        <TopHeader />
      </div>
      <div className="max-w-7xl min-h-24 mx-auto flex justify-between items-center px-5 h-full w-full">
        <div className="">
          <img src="/AST-Logo-white.png" alt="Logo AST" className="w-30" />
        </div>
        <div className="relative">
          <NavBar />
        </div>
      </div>
    </motion.header>
  );
}

export default Header;
