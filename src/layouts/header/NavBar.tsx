import { NavLink } from "react-router";
import { useMenuNavItems } from "../hooks/useMenuNavItems";

function NavBar() {
  const { menuItems } = useMenuNavItems();

  return (
    <ul className="flex justify-center items-center">
      {menuItems.map((item) => (
        <li
          key={item.order}
          className="relative group px-5 py-9 border-t-4 border-t-transparent hover:border-t-primary-100 transition-colors duration-300"
        >
          <NavLink
            to={item.path}
            className="text-sm  py-9  font-light h-full hover:text-white-100/90 transition-colors duration-300"
            style={({ isActive }) => ({
              borderTopColor: isActive ? "var(--color-primary-100)" : "",
            })}
          >
            {item.title}
          </NavLink>

          {/* Submenu */}
          {item.submenu && item.submenu.length > 0 && (
            <ul className="absolute top-23 left-0 hidden h-0 group-hover:h-full transition-all duration-500 group-hover:flex flex-col bg-bg-200  rounded-t-none rounded-b shadow-lg min-w-50 z-10">
              {item.submenu.map((subItem) => (
                <li
                  key={subItem.path}
                  className="py-3 px-5 w-full hover:bg-bg-100 transition-all duration-300 hover:text-primary-100"
                >
                  <NavLink
                    className="block text-sm font-light w-full"
                    to={subItem.path}
                  >
                    {subItem.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

export default NavBar;
