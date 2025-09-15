import { useCallback, useEffect, useState } from "react";
import type { NavMenuItem } from "../types/NavMenu";
import { getNavMenuItems } from "../services/NavMenu";

export const useMenuNavItems = () => {
  const [menuItems, setMenuItems] = useState<NavMenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await getNavMenuItems();
      setMenuItems(items);
    } catch (err) {
      setError((err as Error).message || "Error al cargar el menú");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  return { menuItems, loading, error, refetch: fetchMenuItems };
};
