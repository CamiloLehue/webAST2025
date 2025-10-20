// import { StrictMode } from "react"; // Deshabilitado para evitar dobles cargas
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import LayoutTemplate from "./layouts/LayoutTemplate";
import AdminLayout from "./layouts/AdminLayout";
import DynamicHome from "./features/home/pages/DynamicHome";
import BlogPage from "./features/blog/pages/BlogPage";
import BlogPostPage from "./features/blog/pages/BlogPostPage";
import DynamicPage from "./components/DynamicPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./features/admin/pages/AdminLogin";
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import MenuManagement from "./features/admin/pages/MenuManagement";
import BlogManagement from "./features/admin/pages/BlogManagement";
import BlogEditor from "./features/admin/pages/BlogEditor";
import PageManagement from "./features/admin/pages/PageManagement";
import PageEditor from "./features/admin/pages/PageEditor";
import UserManagement from "./features/admin/pages/UserManagement";
import MultimediaManagement from "./features/admin/multimedia-management/pages/MultimediaManagement";
import HomeEditor from "./features/admin/home-management/pages/HomeEditor";
import { BreakpointProvider } from "./context/ProviderBreakpoints";
import { AuthProvider } from "./context/AuthContext";
import { ContentProvider } from "./context/ContentContext";
import { ToastProvider } from "./context/ToastContext";
// import About from "./features/about/pages/About";
// import Products from "./features/products/pages/Products";
// import Datacenter from "./features/services/pages/Datacenter";
// import EmpresaSustentable from "./features/services/pages/EmpresaSustentable";
// import Satelital from "./features/services/pages/Satelital";
// import Seguridad from "./features/services/pages/Seguridad";
// import Services from "./features/services/pages/Services";
// import Wireless from "./features/services/pages/Wireless";
// import Wisensor from "./features/services/pages/Wisensor";
// import WisensorIa from "./features/services/pages/WisensorIa";
// import IoT from "./features/services/pages/IoT";
// import RoIp from "./features/services/pages/RoIp";
// import NetworkIp from "./features/services/pages/NetworkIp";
// import Drones from "./features/services/pages/Drones";
// import Software from "./features/services/pages/Software";

createRoot(document.getElementById("root")!).render(
  // StrictMode deshabilitado para evitar dobles cargas en desarrollo
  // <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <ContentProvider>
          <BreakpointProvider>
            <BrowserRouter>
            <Routes>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="home" element={<HomeEditor />} />
                <Route path="menu" element={<MenuManagement />} />
                <Route path="blog" element={<BlogManagement />} />
                <Route path="blog/new" element={<BlogEditor />} />
                <Route path="blog/edit/:id" element={<BlogEditor />} />
                <Route path="pages" element={<PageManagement />} />
                <Route path="pages/new" element={<PageEditor />} />
                <Route path="pages/edit/:id" element={<PageEditor />} />
                <Route path="multimedia" element={<MultimediaManagement />} />
                <Route path="users" element={<UserManagement />} />
              </Route>

              <Route element={<LayoutTemplate />}>
                <Route path="/" element={<DynamicHome />} />
                {/* <Route path="/sobre-nosotros" element={<About />} />
                <Route path="/productos" element={<Products />} />
                <Route path="/datacenter" element={<Datacenter />} />
                <Route
                  path="/empresa-sustentable"
                  element={<EmpresaSustentable />}
                /> */}
                {/* <Route path="/satelital" element={<Satelital />} />
                <Route path="/seguridad" element={<Seguridad />} />
                <Route path="/servicios" element={<Services />} />
                <Route path="/wireless" element={<Wireless />} />
                <Route path="/wisensor" element={<Wisensor />} />
                <Route path="/wisensor-ia" element={<WisensorIa />} />
                <Route path="/iot" element={<IoT />} />
                <Route path="/roip" element={<RoIp />} />
                <Route path="/network-ip" element={<NetworkIp />} />
                <Route path="/drones" element={<Drones />} />
                <Route path="/software" element={<Software />} /> */}
                {/* <Route path="/multimedia" element={<Multimedia />} /> */}

                {/* <Route path="/noticias" element={<News />} /> */}
                <Route path="/noticias" element={<BlogPage />} />
                <Route path="/noticias/:slug" element={<BlogPostPage />} />

                {/* Excluir rutas del sistema de ser manejadas por DynamicPage */}
                <Route path="/api/*" element={<div>API Route</div>} />

                {/* rutas dinamicas, para crear web desde el panel administrativo */}
                <Route path="/:slug" element={<DynamicPage />} />
              </Route>
            </Routes>
            </BrowserRouter>
          </BreakpointProvider>
        </ContentProvider>
      </ToastProvider>
    </AuthProvider>
  // </StrictMode>
);
