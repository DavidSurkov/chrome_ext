import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        background: resolve(__dirname, "src", "background.ts"), // Ensures background.ts is an entry point
        popup: resolve(__dirname, "popup.html"), // Handles popup
      },
      output: {
        format: "esm", // Sets the module format; change as needed
        dir: "dist", // Outputs files to 'dist' directory
        entryFileNames: "[name].js", // Output naming convention
        /*chunkFileNames: 'assets/[name]-[hash].js', // Optional: configure how chunks are named
        assetFileNames: 'assets/[name]-[hash].[ext]', // Optional: configure how assets are named*/
      },
    },
  },
});
