import { useEffect } from "react";
import { useHomeManagement } from "../../admin/home-management/hooks/useHomeManagement";
import EditableHome from "./EditableHome";
import Home from "./Home";
import { notifyContentLoading } from "../../../utils/contentLoadingEvents";

function DynamicHome() {
  const { homeData, loading } = useHomeManagement();

  useEffect(() => {
    if (loading) {
      notifyContentLoading();
    }
  }, [loading]);

  if (loading) {
    return null;
  }

  if (homeData && homeData.isPublished) {
    return <EditableHome />;
  }

  return <Home />;
}

export default DynamicHome;
