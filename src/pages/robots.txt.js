export function GET() {
  const site = "https://mycompanionpet.com";
  const body = `User-agent: *
Allow: /

Sitemap: ${site}/sitemap-index.xml
Sitemap: ${site}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
