import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import LayoutTemplate from "./layouts/LayoutTemplate";
import Home from "./features/home/pages/Home";
import About from "./features/about/pages/About";
import Products from "./features/products/pages/Products";
import Services from "./features/services/pages/Services";
import Multimedia from "./features/multimedia/pages/Multimedia";
import News from "./features/news/pages/News";
import { BreakpointProvider } from "./context/ProviderBreakpoints";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BreakpointProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<LayoutTemplate />}>
            <Route path="/" element={<Home />} />
            <Route path="/sobre-nosotros" element={<About />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/servicios" element={<Services />} />
            <Route path="/multimedia" element={<Multimedia />} />
            <Route path="/noticias" element={<News />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </BreakpointProvider>
  </StrictMode>
);
