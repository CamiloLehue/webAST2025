import { useContent } from "../../hooks/useContent";
import { useMenuNavItems as useOldMenuNavItems } from "../hooks/useMenuNavItems";
import type { MenuItem } from "../../types/content";
import type { NavMenuItem } from "../types/NavMenu";

interface CompatibilityMenuHook {
  menuItems: MenuItem[];
  loading: boolean;
  error: string | null;
  isUsingNewAPI: boolean;
}

const convertNavMenuToMenuItem = (
  navItem: NavMenuItem,
  index: number
): MenuItem => ({
  id: `nav-${index + 1}`,
  title: navItem.title,
  path: navItem.path,
  external: navItem.external || false,
  disabled: navItem.disabled || false,
  order: navItem.order || index + 1,
  contentType: "page",
  submenu: navItem.submenu?.map((subItem, subIndex) => ({
    id: `nav-${index + 1}-${subIndex + 1}`,
    title: subItem.title,
    path: subItem.path,
    external: subItem.external || false,
    disabled: subItem.disabled || false,
    order: subItem.order || subIndex + 1,
    contentType: "page" as const,
  })),
});

export const useMenuNavItemsCompat = (): CompatibilityMenuHook => {
  const {
    menuItems: newMenuItems,
    loading: newLoading,
    error: newError,
  } = useContent();

  const {
    menuItems: oldMenuItems,
    loading: oldLoading,
    error: oldError,
  } = useOldMenuNavItems();

  const hasNewData = newMenuItems && newMenuItems.length > 0;
  const isNewSystemReady = !newLoading && !newError;
  const useNewAPI = isNewSystemReady && hasNewData;

  if (useNewAPI) {
    return {
      menuItems: newMenuItems,
      loading: newLoading,
      error: newError,
      isUsingNewAPI: true,
    };
  } else {
    const convertedItems = oldMenuItems.map(convertNavMenuToMenuItem);

    return {
      menuItems: convertedItems,
      loading: oldLoading,
      error:
        oldError ||
        (newError && !hasNewData
          ? "Usando sistema de menú local como fallback"
          : null),
      isUsingNewAPI: false,
    };
  }
};

export default useMenuNavItemsCompat;
