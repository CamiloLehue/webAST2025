import type { HomeData, HomeUpdateSchema } from "../types/homeTypes";

const API_URL = import.meta.env.VITE_API_URL;

export class HomeService {
  private static readonly BASE_URL = `${API_URL}/home`;

  /**
   * Obtiene la configuración actual del Home
   */
  static async getHomeData(): Promise<HomeData | null> {
    try {
      const response = await fetch(this.BASE_URL);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error("Error fetching home data:", error);
      throw error;
    }
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
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
      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
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
