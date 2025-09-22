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
import News from "./features/news/pages/News";
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
import { BreakpointProvider } from "./context/ProviderBreakpoints";
import { AuthProvider } from "./context/AuthContext";
import { ContentProvider } from "./context/ContentContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ContentProvider>
        <BreakpointProvider>
          <BrowserRouter>
            <Routes>
              {/* Admin Routes */}
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
              </Route>

              {/* Public Routes */}
              <Route element={<LayoutTemplate />}>
                <Route path="/" element={<Home />} />
                <Route path="/sobre-nosotros" element={<About />} />
                {/* <Route path="/productos" element={<Products />} /> */}
                {/* <Route path="/servicios" element={<Services />} /> */}
                <Route path="/multimedia" element={<Multimedia />} />
                <Route path="/noticias" element={<News />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
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
