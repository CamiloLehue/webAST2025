import { NavLink } from "react-router";
import { useContent } from "../../hooks/useContent";
import { useBreakpoints } from "../../context/ProviderBreakpoints";
import type { MenuItem } from "../../types/content";
import { useState } from "react";
import { TbChevronDown, TbMenu2, TbMenuDeep } from "react-icons/tb";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

function NavBar() {
  const { menuItems, loading, error } = useContent();
  const { isSmallDevice, isMediumDevice } = useBreakpoints();

  if (loading) {
    return (
      <nav className={`${
        isSmallDevice || isMediumDevice
          ? "absolute top-0 right-0 h-full"
          : "p-0"
      }`}>
        <div className="flex items-center justify-center p-4">
          <span className="text-sm text-gray-500">Cargando menú...</span>
        </div>
      </nav>
    );
  }

  if (error) {
    console.error('Error en NavBar:', error);
  }

  return (
    <nav
      className={`${
        isSmallDevice || isMediumDevice
          ? "absolute top-0 right-0 h-full"
          : "p-0"
      }`}
    >
      {isSmallDevice || isMediumDevice ? (
        <NavSmallDevice menuItems={menuItems} />
      ) : (
        <NavDesktopDevice menuItems={menuItems} />
      )}
    </nav>
  );
}

const NavDesktopDevice = ({ menuItems }: { menuItems: MenuItem[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <ul className="flex justify-end items-center gap-10">
      {menuItems
        .filter((item) => !item.disabled)
        .sort((a, b) => a.order - b.order)
        .map((item, index) => (
          <li
            key={item.id}
            className="relative  py-8 border-t-4 border-t-transparent hover:border-t-primary-100 transition-colors duration-300"
            onMouseEnter={() => setOpenIndex(index)}
            onMouseLeave={() => setOpenIndex(null)}
          >
            <NavLink
              to={item.path}
              className="text-sm tracking-wider py-8 font-normal uppercase text-nowrap h-full hover:text-white-100/90 transition-colors duration-300"
              style={({ isActive }) => ({
                borderTopColor: isActive ? "var(--color-primary-100)" : "",
                color: isActive ? "var(--color-primary-100)" : "",
              })}
            >
              <span className="flex flex-nowrap justify-center items-center gap-2">
                {item.title}
                {item.submenu && item.submenu.length > 0 && <TbChevronDown />}
              </span>
            </NavLink>

            {item.submenu && item.submenu.length > 0 && (
              <AnimatePresence>
                {openIndex === index && (
                  <motion.ul
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-15 -left-0 flex flex-col bg-bg-200 rounded-2xl overflow-hidden shadow-lg min-w-50 z-10"
                  >
                    {item.submenu
                      .filter((subItem) => !subItem.disabled)
                      .sort((a, b) => a.order - b.order)
                      .map((subItem, subIndex) => (
                      <motion.li
                        key={subItem.id}
                        className="py-5 px-8 w-full hover:bg-bg-400 transition-all duration-300 hover:text-primary-100"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.04 * subIndex }}
                      >
                        <NavLink
                          className="block text-sm font-light w-full text-nowrap"
                          to={subItem.path}
                        >
                          {subItem.title}
                        </NavLink>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            )}
          </li>
        ))}
    </ul>
  );
};

const NavSmallDevice = ({ menuItems }: { menuItems: MenuItem[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);
  const { shouldReduceMotion } = useReducedMotion();

  return (
    <div className=" h-full w-full ">
      <motion.button
        whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
        animate={shouldReduceMotion ? undefined : { rotate: isOpen ? 360 : 0, scale: isOpen ? 1.2 : 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: "keyframes", duration: 0.1 }}
        className={`absolute h-full w-full z-50 ${
          isOpen ? "bottom-0 right-0  h-full bg-accent-100 " : "top-0 right-0"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <TbMenuDeep /> : <TbMenu2 />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: -20 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -20 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
            className="fixed inset-0 flex flex-col items-center justify-start bg-bg-400 w-full h-full pt-20 overflow-y-auto"
          >
            {menuItems
              .filter((item) => !item.disabled)
              .sort((a, b) => a.order - b.order)
              .map((item, index) => (
              <motion.li
                key={item.id}
                className="w-full"
                initial={shouldReduceMotion ? undefined : { opacity: 0, x: -50 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, x: -50 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, delay: 0.05 * index }}
              >
                <div className="px-10 py-5">
                  <div className="flex items-center justify-between">
                    <NavLink
                      className="block text-sm font-light hover:text-primary-100"
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </NavLink>
                    {item.submenu && item.submenu.length > 0 && (
                      <button
                        onClick={() => setExpandedSubmenu(
                          expandedSubmenu === item.id ? null : item.id
                        )}
                        className="ml-2 p-1"
                      >
                        <TbChevronDown 
                          className={`transition-transform duration-200 ${
                            expandedSubmenu === item.id ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>
                  
                  {item.submenu && item.submenu.length > 0 && expandedSubmenu === item.id && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 ml-4 space-y-2"
                    >
                      {item.submenu
                        .filter((subItem) => !subItem.disabled)
                        .sort((a, b) => a.order - b.order)
                        .map((subItem) => (
                        <motion.li
                          key={subItem.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <NavLink
                            className="block text-xs font-light text-gray-300 hover:text-primary-100 py-2"
                            to={subItem.path}
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.title}
                          </NavLink>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavBar;
