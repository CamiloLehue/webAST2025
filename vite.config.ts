import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0", //PERMITIR CUALQUIER IP
    port: 5180, //PUERTO
    allowedHosts: ["astdemo.cl", "admin.astdemo.cl", "localhost"], //PERMITIR DOMINIOS
  },
  build: {
    // Configurar límites para archivos grandes
    assetsInlineLimit: 0, // No inlinear assets, siempre usar archivos separados
    rollupOptions: {
      output: {
        // Configurar límites de tamaño más grandes para assets
        assetFileNames: (assetInfo) => {
          // Mantener nombres originales para imágenes
          if (assetInfo.name && /\.(png|jpe?g|gif|svg|webp|avif)$/i.test(assetInfo.name)) {
            return 'assets/images/[name].[hash][extname]';
          }
          return 'assets/[name].[hash][extname]';
        },
      },
    },
  },
  // Configurar para manejar archivos grandes de imágenes
  optimizeDeps: {
    exclude: [], // Excluir dependencias que causeen problemas
  },
});
