import type { NavMenuItem } from "../types/NavMenu";

// const API_URL = import.meta.env.VITE_API_URL;

export const getNavMenuItems = async (): Promise<NavMenuItem[]> => {
  // try {
  //   if (!API_URL) throw new Error("API_URL not defined");

  //   const response = await fetch(`${API_URL}/navigation`);
  //   if (!response.ok) {
  //     throw new Error("Failed to fetch navigation data from API");
  //   }

  //   const menu: NavMenuItem[] = await response.json();
  //   return menu;
  // } catch (error) {
  //   console.warn("🌐 API error, loading fallback JSON", error);

  //   const localMenu = await import("../json/MenuNavItems.json");w
  //   return localMenu.default as NavMenuItem[];
  // }

  const localMenu = await import("../json/MenuNavItems.json");
    return localMenu.default as NavMenuItem[];
};
