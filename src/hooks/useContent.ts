import { useContext } from 'react';
import { ContentContext } from '../context/ContentContext';

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent debe ser usado dentro de un ContentProvider');
  }
  return context;
};