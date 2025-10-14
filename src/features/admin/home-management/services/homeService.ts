import type { HomeData, HomeUpdateSchema } from "../types/homeTypes";
import { apiCache } from "../../../../utils/apiCache";

const API_URL = import.meta.env.VITE_API_URL;

export class HomeService {
  private static readonly BASE_URL = `${API_URL}/home`;

  /**
   * Obtiene la configuración actual del Home
   */
  static async getHomeData(): Promise<HomeData | null> {
    return apiCache.get('home-data', async () => {
      try {
        const response = await fetch(this.BASE_URL);
        
        if (!response.ok) {
          if (response.status === 404) {
            return null;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const rawHomeData = data.data || data;
        
        console.log("HomeData recibido del backend:", rawHomeData);
        
        // Si el backend usa _id (MongoDB), mapearlo a id
        const homeData = rawHomeData && rawHomeData._id && !rawHomeData.id
          ? { ...rawHomeData, id: rawHomeData._id }
          : rawHomeData;
        
        if (rawHomeData && rawHomeData._id && !rawHomeData.id) {
          console.log("Mapeando _id a id:", rawHomeData._id);
        }
        
        // Verificar que el ID esté presente
        if (homeData && !homeData.id) {
          console.warn("El backend no devolvió un ID para home data");
        }
        
        return homeData;
      } catch (error) {
        console.error("Error fetching home data:", error);
        throw error;
      }
    });
  }

  /**
   * Crea la configuración inicial del Home
   */
  static async createHomeData(homeData: Omit<HomeData, "id" | "createdAt" | "updatedAt">): Promise<HomeData> {
    try {
      const response = await fetch(this.BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(homeData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error creando home:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const rawHomeData = data.data || data;
      
      console.log("Home creado, respuesta del backend:", rawHomeData);
      
      // Si el backend usa _id (MongoDB), mapearlo a id
      const createdHomeData = rawHomeData && rawHomeData._id && !rawHomeData.id
        ? { ...rawHomeData, id: rawHomeData._id }
        : rawHomeData;
      
      if (rawHomeData && rawHomeData._id && !rawHomeData.id) {
        console.log("Mapeando _id a id en respuesta de creación:", rawHomeData._id);
      }
      
      // Invalidar cache después de crear
      apiCache.invalidate('home-data');
      
      return createdHomeData;
    } catch (error) {
      console.error("Error creating home data:", error);
      throw error;
    }
  }

  /**
   * Actualiza la configuración del Home
   */
  static async updateHomeData(id: string, updates: HomeUpdateSchema): Promise<HomeData> {
    try {
      if (!id || id === "undefined" || id === "null") {
        throw new Error("ID inválido para actualizar home data");
      }

      console.log(`Actualizando home con ID: ${id}`);
      console.log("URL completa:", `${this.BASE_URL}/${id}`);
      console.log("Datos a actualizar:", updates);

      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      const rawHomeData = data.data || data;
      
      console.log("Home actualizado, respuesta del backend:", rawHomeData);
      
      // Si el backend usa _id (MongoDB), mapearlo a id
      const updatedHomeData = rawHomeData && rawHomeData._id && !rawHomeData.id
        ? { ...rawHomeData, id: rawHomeData._id }
        : rawHomeData;
      
      if (rawHomeData && rawHomeData._id && !rawHomeData.id) {
        console.log("Mapeando _id a id en respuesta de actualización:", rawHomeData._id);
      }
      
      // Invalidar cache después de actualizar
      apiCache.invalidate('home-data');
      
      return updatedHomeData;
    } catch (error) {
      console.error("Error updating home data:", error);
      throw error;
    }
  }

  /**
   * Publica o despublica el Home
   */
  static async togglePublish(id: string, isPublished: boolean): Promise<HomeData> {
    return this.updateHomeData(id, { isPublished });
  }
}
