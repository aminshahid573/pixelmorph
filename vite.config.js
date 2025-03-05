import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: "https://pixelmorph.netlify.app/",
      dynamicRoutes: generateDynamicRoutes(), // Function to generate dynamic routes
    }),
  ],
});

// Function to generate sitemap-friendly dynamic routes
function generateDynamicRoutes() {
  const formats = ["jpg", "png", "ico", "svg"];
  const dynamicRoutes = [];

  formats.forEach(from => {
    formats.forEach(to => {
      if (from !== to) {
        dynamicRoutes.push(`/convert/${from}/${to}`);
      }
    });
  });

  return dynamicRoutes;
}
