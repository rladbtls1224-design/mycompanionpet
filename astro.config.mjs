import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");
const site = env.SITE_URL || "https://petnutritionguide.com";

export default defineConfig({
  site,
  integrations: [sitemap()],
});
