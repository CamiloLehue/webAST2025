import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0", //PERMITIR CUALQUIER IP
    port: 5180, //PUERTO
    allowedHosts: ["ast.cl", "admin.ast.cl", "localhost"], //PERMITIR DOMINIOS
  },
});
