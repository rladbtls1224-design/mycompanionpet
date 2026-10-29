import fs from "node:fs";
import path from "node:path";

// Read the exact public ID emitted by Astro (including .env / hosting variables).
// Do not create a placeholder ads.txt: it would publish an invalid seller account.
const outputDir = path.resolve("dist");
const html = fs.readFileSync(path.join(outputDir, "index.html"), "utf8");
const client = html.match(/<meta\s+name="google-adsense-account"\s+content="(ca-pub-\d{16})"\s*\/?\s*>/)?.[1];
const adsPath = path.join(outputDir, "ads.txt");

if (client) {
  fs.writeFileSync(adsPath, `google.com, ${client.replace("ca-", "")}, DIRECT, f08c47fec0942fa0\n`);
  console.log("[AdSense] Ownership meta and ads.txt generated. Ad scripts remain disabled.");
} else {
  // Only remove a stale generated file in the known build output directory.
  if (fs.existsSync(adsPath)) fs.unlinkSync(adsPath);
  console.log("[AdSense] No publisher ID configured; no ads.txt or ad requests generated.");
}
