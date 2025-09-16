import { NavLink } from "react-router";
import { useMenuNavItems } from "../hooks/useMenuNavItems";
import { useBreakpoints } from "../../context/ProviderBreakpoints";
import type { NavMenuItem } from "../types/NavMenu";
import { useState } from "react";
import { TbMenu2, TbMenuDeep } from "react-icons/tb";
import { AnimatePresence, motion } from "motion/react";

function NavBar() {
  const { menuItems } = useMenuNavItems();
  const { isSmallDevice, isMediumDevice } = useBreakpoints();

  return (
    <nav
      className={`${
        isSmallDevice || isMediumDevice ? "absolute top-0 right-0 h-full" : "p-0"
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

const NavDesktopDevice = ({ menuItems }: { menuItems: NavMenuItem[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <ul className="flex justify-center items-center">
      {menuItems.map((item, index) => (
        <li
          key={item.order}
          className="relative px-5 py-9 border-t-4 border-t-transparent hover:border-t-primary-100 transition-colors duration-300"
          onMouseEnter={() => setOpenIndex(index)}
          onMouseLeave={() => setOpenIndex(null)}
        >
          <NavLink
            to={item.path}
            className="text-sm py-9 font-light h-full hover:text-white-100/90 transition-colors duration-300"
            style={({ isActive }) => ({
              borderTopColor: isActive ? "var(--color-primary-100)" : "",
            })}
          >
            {item.title}
          </NavLink>

          {item.submenu && item.submenu.length > 0 && (
            <AnimatePresence>
              {openIndex === index && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-24 left-0 flex flex-col bg-bg-200 rounded-b shadow-lg min-w-50 z-10"
                >
                  {item.submenu.map((subItem, subIndex) => (
                    <motion.li
                      key={subItem.path}
                      className="py-3 px-5 w-full hover:bg-bg-100 transition-all duration-300 hover:text-primary-100"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2, delay: 0.05 * subIndex }}
                    >
                      <NavLink
                        className="block text-sm font-light w-full"
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

const NavSmallDevice = ({ menuItems }: { menuItems: NavMenuItem[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className=" h-full w-full ">
      <motion.button
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 360 : 0, scale: isOpen ? 1.2 : 1 }}
        transition={{ type: "keyframes", duration: 0.1 }}
        className={`absolute h-full w-full z-50 ${isOpen ? "bottom-0 right-0  h-full bg-accent-100 " : "top-0 right-0"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <TbMenuDeep /> : <TbMenu2 />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex flex-col items-center justify-start bg-bg-400 w-full h-full"
          >
            {menuItems.map((item, index) => (
              <motion.li
                key={item.order}
                className="px-10 py-5"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2, delay: 0.05 * index }}
              >
                <NavLink
                  className="block text-sm font-light w-full hover:text-primary-100"
                  to={item.path}
                >
                  {item.title}
                </NavLink>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavBar;
