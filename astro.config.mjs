import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const site = "https://mycompanionpet.com";

export default defineConfig({
  site,
  integrations: [sitemap()],
});
