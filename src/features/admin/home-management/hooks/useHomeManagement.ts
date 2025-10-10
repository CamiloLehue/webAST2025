import { useState, useEffect, useCallback } from "react";
import { HomeService } from "../services/homeService";
import type { HomeData, HomeUpdateSchema } from "../types/homeTypes";

export const useHomeManagement = () => {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadHomeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await HomeService.getHomeData();
      setHomeData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los datos del inicio");
      console.error("Error loading home data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  const createHome = useCallback(async (data: Omit<HomeData, "id" | "createdAt" | "updatedAt">) => {
    try {
      setIsSaving(true);
      setError(null);
      const newHome = await HomeService.createHomeData(data);
      setHomeData(newHome);
      return newHome;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la configuración del inicio");
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const updateHome = useCallback(async (id: string, updates: HomeUpdateSchema) => {
    try {
      setIsSaving(true);
      setError(null);
      const updatedHome = await HomeService.updateHomeData(id, updates);
      setHomeData(updatedHome);
      return updatedHome;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar el inicio");
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const togglePublish = useCallback(async (id: string, isPublished: boolean) => {
    try {
      setIsSaving(true);
      setError(null);
      const updatedHome = await HomeService.togglePublish(id, isPublished);
      setHomeData(updatedHome);
      return updatedHome;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cambiar el estado de publicación");
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    homeData,
    loading,
    error,
    isSaving,
    loadHomeData,
    createHome,
    updateHome,
    togglePublish,
  };
};
