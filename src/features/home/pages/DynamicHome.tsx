import { useHomeManagement } from "../../admin/home-management/hooks/useHomeManagement";
import EditableHome from "./EditableHome";
import Home from "./Home";

function DynamicHome() {
  const { homeData, loading } = useHomeManagement();

  // Mientras carga, mostrar el Home estático
  if (loading) {
    return <Home />;
  }

  // Si hay datos editables y está publicado, mostrar EditableHome
  if (homeData && homeData.isPublished) {
    return <EditableHome />;
  }

  // Por defecto, mostrar Home estático
  return <Home />;
}

export default DynamicHome;
