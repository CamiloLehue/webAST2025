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
      <nav className="relative p-4">
        <div className="flex items-center justify-center">
          <span className="text-sm text-gray-500">Cargando menú...</span>
        </div>
      </nav>
    );
  }

  if (error) {
    console.error("Error en NavBar:", error);
  }

  return (
    <nav className={`${isSmallDevice || isMediumDevice ? "relative" : "p-0"}`}>
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
            className="relative  py-9 border-t-4 border-t-transparent hover:border-t-primary-100 transition-colors duration-300"
            onMouseEnter={() => setOpenIndex(index)}
            onMouseLeave={() => setOpenIndex(null)}
          >
            <NavLink
              to={item.path !== "/none" ? item.path : "//"}
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
                          className="py-3 px-8 w-full hover:bg-bg-400 transition-all duration-300 hover:text-primary-100"
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

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
    setExpandedSubmenu(null);
  };

  return (
    <div className="relative w-full h-full">
      <button
        onClick={handleToggleMenu}
        className={`flex items-center justify-center p-2 transition-colors ${
          isOpen ? "text-primary-100" : "text-white-100"
        }`}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <TbMenuDeep size={28} /> : <TbMenu2 size={28} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/20 z-[9998] "
              onClick={handleCloseMenu}
              style={{ top: 0, left: 0, right: 0, bottom: 0 }}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed -top-6 -right-5 bottom-0 w-full bg-bg-400 min-w-screen z-[9999] overflow-y-auto shadow-2xl"
              style={{ height: "100vh" }}
            >
              <div className="sticky top-0 bg-bg-400 z-10 border-b border-bg-200 px-6 py-4 flex items-center justify-between">
                <span className="text-lg font-semibold text-primary-100">
                  MENÚ
                </span>
                <button
                  onClick={handleCloseMenu}
                  className="p-2 text-white-100 hover:text-primary-100 transition-colors"
                  aria-label="Close menu"
                >
                  <TbMenuDeep size={24} />
                </button>
              </div>

              {/* Lista del menú */}
              <nav className="px-6 py-4">
                <ul className="flex flex-col gap-1">
                  {menuItems
                    .filter((item) => !item.disabled)
                    .sort((a, b) => a.order - b.order)
                    .map((item, index) => (
                      <motion.li
                        key={item.id}
                        initial={
                          shouldReduceMotion ? false : { opacity: 0, x: 50 }
                        }
                        animate={
                          shouldReduceMotion ? false : { opacity: 1, x: 0 }
                        }
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="border-b border-bg-200/50 last:border-b-0"
                      >
                        <div className="py-4">
                          <div className="flex items-center justify-between gap-3">
                            <NavLink
                              to={item.path}
                              onClick={handleCloseMenu}
                              className="flex-1 text-sm font-medium uppercase tracking-wide text-white-100 hover:text-primary-100 transition-colors"
                              style={({ isActive }) => ({
                                color: isActive
                                  ? "var(--color-primary-100)"
                                  : "",
                              })}
                            >
                              {item.title}
                            </NavLink>

                            {item.submenu && item.submenu.length > 0 && (
                              <button
                                onClick={() =>
                                  setExpandedSubmenu(
                                    expandedSubmenu === item.id ? null : item.id
                                  )
                                }
                                className="p-2 text-white-100 hover:text-primary-100 transition-colors"
                                aria-label={`Toggle ${item.title} submenu`}
                              >
                                <TbChevronDown
                                  className={`transition-transform duration-200 ${
                                    expandedSubmenu === item.id
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                  size={20}
                                />
                              </button>
                            )}
                          </div>

                          <AnimatePresence>
                            {item.submenu &&
                              item.submenu.length > 0 &&
                              expandedSubmenu === item.id && (
                                <motion.ul
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-3 pl-4 space-y-2 border-l-2 border-primary-100/30">
                                    {item.submenu
                                      .filter((subItem) => !subItem.disabled)
                                      .sort((a, b) => a.order - b.order)
                                      .map((subItem) => (
                                        <li key={subItem.id}>
                                          <NavLink
                                            to={subItem.path}
                                            onClick={handleCloseMenu}
                                            className="block text-sm text-gray-300 hover:text-primary-100 py-2 transition-colors"
                                            style={({ isActive }) => ({
                                              color: isActive
                                                ? "var(--color-primary-100)"
                                                : "",
                                            })}
                                          >
                                            {subItem.title}
                                          </NavLink>
                                        </li>
                                      ))}
                                  </div>
                                </motion.ul>
                              )}
                          </AnimatePresence>
                        </div>
                      </motion.li>
                    ))}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavBar;
