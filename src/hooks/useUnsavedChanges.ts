import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Hook para detectar cambios sin guardar y prevenir navegación accidental
 * Compatible con BrowserRouter (no requiere data router)
 * @param hasUnsavedChanges - Booleano que indica si hay cambios sin guardar
 * @returns Objeto con confirmDialog state y funciones
 */
export const useUnsavedChanges = (hasUnsavedChanges: boolean) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [nextLocation, setNextLocation] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const shouldBlockRef = useRef(hasUnsavedChanges);

  // Mantener la referencia actualizada
  useEffect(() => {
    shouldBlockRef.current = hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  // Interceptar clicks en enlaces de navegación
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!shouldBlockRef.current) return;

      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && !link.target) {
        const url = new URL(link.href);
        const targetPath = url.pathname;
        
        // Solo interceptar si es navegación interna y diferente a la ruta actual
        if (url.origin === window.location.origin && targetPath !== location.pathname) {
          e.preventDefault();
          setNextLocation(targetPath);
          setShowConfirmDialog(true);
        }
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [location.pathname]);

  // Interceptar navegación del navegador (back/forward)
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handlePopState = () => {
      if (shouldBlockRef.current) {
        // Prevenir la navegación restaurando el estado
        window.history.pushState(null, '', location.pathname);
        setNextLocation(window.location.pathname);
        setShowConfirmDialog(true);
      }
    };

    // Agregar un estado para poder detectar cambios
    window.history.pushState(null, '', location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges, location.pathname]);

  // Prevenir cierre de pestaña/ventana cuando hay cambios sin guardar
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ''; // Chrome requiere returnValue
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const confirmNavigation = useCallback(() => {
    setShowConfirmDialog(false);
    shouldBlockRef.current = false; // Deshabilitar temporalmente el bloqueo
    
    if (nextLocation) {
      const tempLocation = nextLocation;
      setNextLocation(null);
      
      // Navegar después de actualizar el estado
      setTimeout(() => {
        navigate(tempLocation);
      }, 0);
    }
  }, [nextLocation, navigate]);

  const cancelNavigation = useCallback(() => {
    setShowConfirmDialog(false);
    setNextLocation(null);
  }, []);

  return {
    showConfirmDialog,
    confirmNavigation,
    cancelNavigation,
  };
};
