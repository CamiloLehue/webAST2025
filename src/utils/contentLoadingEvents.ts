/**
 * Sistema de eventos para coordinar el loading entre LayoutTemplate y páginas dinámicas
 * 
 * Uso:
 * - DynamicPage llama a notifyContentLoading() cuando empieza a cargar
 * - DynamicPage llama a notifyContentReady() cuando termina de cargar
 * - LayoutTemplate escucha estos eventos para saber cuándo ocultar el LoadingScreen
 */

type ContentLoadingListener = (isLoading: boolean) => void;

class ContentLoadingManager {
  private listeners: Set<ContentLoadingListener> = new Set();
  private isContentLoading = false;

  /**
   * Notifica que el contenido está cargando
   */
  notifyLoading() {
    console.log('[ContentLoading] Content started loading');
    this.isContentLoading = true;
    this.emit(true);
  }

  /**
   * Notifica que el contenido está listo
   */
  notifyReady() {
    console.log('[ContentLoading] Content is ready');
    this.isContentLoading = false;
    this.emit(false);
  }

  /**
   * Obtiene el estado actual
   */
  getIsLoading(): boolean {
    return this.isContentLoading;
  }

  /**
   * Suscribe un listener
   */
  subscribe(listener: ContentLoadingListener): () => void {
    this.listeners.add(listener);
    
    // Retorna función de cleanup
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Emite el evento a todos los listeners
   */
  private emit(isLoading: boolean) {
    this.listeners.forEach(listener => {
      try {
        listener(isLoading);
      } catch (error) {
        console.error('[ContentLoading] Error in listener:', error);
      }
    });
  }

  /**
   * Reset para testing
   */
  reset() {
    this.isContentLoading = false;
    this.listeners.clear();
  }
}

// Singleton
export const contentLoadingManager = new ContentLoadingManager();

// Helpers para usar en componentes
export const notifyContentLoading = () => contentLoadingManager.notifyLoading();
export const notifyContentReady = () => contentLoadingManager.notifyReady();
export const subscribeToContentLoading = (listener: ContentLoadingListener) => 
  contentLoadingManager.subscribe(listener);
export const isContentLoading = () => contentLoadingManager.getIsLoading();
