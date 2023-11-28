import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  server: {
    host: "0.0.0.0",
    https: {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
      passphrase: "0000",
    },
  },
});
