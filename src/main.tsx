import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import LayoutTemplate from "./layouts/LayoutTemplate";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./features/home/pages/Home";
import About from "./features/about/pages/About";
import Products from "./features/products/pages/Products";
import Services from "./features/services/pages/Services";
import Multimedia from "./features/multimedia/pages/Multimedia";
// import News from "./features/news/pages/News";
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
import { BreakpointProvider } from "./context/ProviderBreakpoints";
import { AuthProvider } from "./context/AuthContext";
import { ContentProvider } from "./context/ContentContext";
import Wisensor from "./features/services/pages/Wisensor";
import Datacenter from "./features/services/pages/Datacenter";
import Seguridad from "./features/services/pages/Seguridad";
import EmpresaSustentable from "./features/services/pages/EmpresaSustentable";
import Satelital from "./features/services/pages/Satelital";
import Wireless from "./features/services/pages/Wireless";
import WisensorIa from "./features/services/pages/WisensorIa";
import IoT from "./features/services/pages/IoT";
import RoIp from "./features/services/pages/RoIp";
import NetworkIp from "./features/services/pages/NetworkIp";
import Drones from "./features/services/pages/Drones";
import Software from "./features/services/pages/Software";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
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
                <Route path="menu" element={<MenuManagement />} />
                <Route path="blog" element={<BlogManagement />} />
                <Route path="blog/new" element={<BlogEditor />} />
                <Route path="blog/edit/:id" element={<BlogEditor />} />
                <Route path="pages" element={<PageManagement />} />
                <Route path="pages/new" element={<PageEditor />} />
                <Route path="pages/edit/:id" element={<PageEditor />} />
                <Route path="users" element={<UserManagement />} />
              </Route>

              <Route element={<LayoutTemplate />}>
                <Route path="/" element={<Home />} />
                <Route path="/sobre-nosotros" element={<About />} />
                <Route path="/productos" element={<Products />} />
                <Route path="/datacenter" element={<Datacenter />} />
                <Route
                  path="/empresa-sustentable"
                  element={<EmpresaSustentable />}
                />
                <Route path="/satelital" element={<Satelital />} />
                <Route path="/seguridad" element={<Seguridad />} />
                <Route path="/servicios" element={<Services />} />
                <Route path="/wireless" element={<Wireless />} />
                <Route path="/wisensor" element={<Wisensor />} />
                <Route path="/wisensor-ia" element={<WisensorIa />} />
                <Route path="/iot" element={<IoT />} />
                <Route path="/roip" element={<RoIp />} />
                <Route path="/network-ip" element={<NetworkIp />} />
                <Route path="/drones" element={<Drones />} />
                <Route path="/software" element={<Software />} />
                <Route path="/multimedia" element={<Multimedia />} />

                {/* <Route path="/noticias" element={<News />} /> */}
                <Route path="/noticias" element={<BlogPage />} />
                <Route path="/noticias/:slug" element={<BlogPostPage />} />
                {/* Dynamic pages route - this should be last to catch all other routes */}
                <Route path="/:slug" element={<DynamicPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </BreakpointProvider>
      </ContentProvider>
    </AuthProvider>
  </StrictMode>
);
