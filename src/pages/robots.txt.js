export function GET() {
  const site = (import.meta.env.SITE_URL || "https://petnutritionguide.com").replace(/\/$/, "");
  const body = `User-agent: *
Allow: /

Sitemap: ${site}/sitemap-index.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
