import fs from "node:fs";
import path from "node:path";

const issues = [];
const root = process.cwd();
const contentDir = path.join(root, "src/content/blog");
const outputDir = path.join(root, "dist");
const publicDir = path.join(root, "public");
const posts = [];
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

for (const file of fs.readdirSync(contentDir).filter((name) => name.endsWith(".md"))) {
  const raw = fs.readFileSync(path.join(contentDir, file), "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) { issues.push(`${file}: missing frontmatter`); continue; }
  const [, frontmatter, body] = match;
  if (/^draft:\s*true\s*$/m.test(frontmatter)) continue;
  const visible = body.replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "").replace(/[#*`>|_-]/g, "").replace(/\s+/g, " ").trim();
  if (visible.length < 2000) issues.push(`${file}: only ${visible.length} visible characters`);
  if (!/\]\(https?:\/\//.test(body)) issues.push(`${file}: no linked external reference`);
  for (const [, date] of frontmatter.matchAll(/^(?:pubDate|updatedDate):\s*["']?(\d{4}-\d{2}-\d{2})/gm)) {
    if (date > today) issues.push(`${file}: future date ${date}`);
  }
  for (const [, label, url] of body.matchAll(/!?\[([^\]]*)\]\((\/[^\s)]+)\)/g)) {
    const pathname = decodeURIComponent(url.split(/[?#]/)[0]);
    if (!pathname) continue;
    if (path.extname(pathname)) {
      if (!fs.existsSync(path.join(publicDir, pathname))) issues.push(`${file}: missing file ${pathname}`);
      if (!fs.existsSync(path.join(outputDir, pathname))) issues.push(`${file}: missing built file ${pathname}`);
    } else if (!fs.existsSync(path.join(outputDir, pathname, "index.html"))) {
      issues.push(`${file}: missing page ${pathname}`);
    }
    if (!label.trim()) issues.push(`${file}: empty link/image description for ${pathname}`);
  }
  posts.push({ slug: file.replace(/\.md$/, ""), chars: visible.length });
}

const listingFiles = [path.join(outputDir, "blog/index.html")];
const pageDir = path.join(outputDir, "blog/page");
if (fs.existsSync(pageDir)) {
  for (const page of fs.readdirSync(pageDir)) listingFiles.push(path.join(pageDir, page, "index.html"));
}
const listed = new Map();
for (const file of listingFiles) {
  if (!fs.existsSync(file)) { issues.push(`Missing listing: ${file}`); continue; }
  const html = fs.readFileSync(file, "utf8");
  for (const [, slug] of html.matchAll(/class="card-link"\s+href="\/blog\/([^/]+)\/"/g)) {
    listed.set(slug, (listed.get(slug) || 0) + 1);
  }
  for (const [, target] of html.matchAll(/href="(\/blog\/(?:page\/\d+\/)?)"/g)) {
    if (!fs.existsSync(path.join(outputDir, target, "index.html"))) issues.push(`Broken pagination: ${target}`);
  }
}

for (const post of posts) {
  if (listed.get(post.slug) !== 1) issues.push(`${post.slug}: listed ${listed.get(post.slug) || 0} times across blog pages`);
  const file = path.join(outputDir, "blog", post.slug, "index.html");
  if (!fs.existsSync(file)) { issues.push(`${post.slug}: missing built article`); continue; }
  const html = fs.readFileSync(file, "utf8");
  const json = html.match(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  try {
    const schema = JSON.parse(json || "null");
    if (schema?.author?.name !== "Pet Nutrition Guide" || !html.includes("작성·수정")) issues.push(`${post.slug}: missing visible author or schema`);
  } catch { issues.push(`${post.slug}: invalid article schema`); }
}

const contact = fs.readFileSync(path.join(outputDir, "contact/index.html"), "utf8");
if (!/href="mailto:[^"]+"/.test(contact) || contact.includes("연결 예정") || contact.includes("문의 양식 예시")) {
  issues.push("Contact page must contain a working mailto address without placeholder form text.");
}
const home = fs.readFileSync(path.join(outputDir, "index.html"), "utf8");
const client = home.match(/name="google-adsense-account"\s+content="(ca-pub-\d{16})"/)?.[1];
const adsFile = path.join(outputDir, "ads.txt");
if (client && (!fs.existsSync(adsFile) || !fs.readFileSync(adsFile, "utf8").includes(client.replace("ca-", "")))) issues.push("AdSense meta and ads.txt do not agree.");
if (!client && fs.existsSync(adsFile)) issues.push("ads.txt must not contain a placeholder publisher ID.");
if (/pagead2\.googlesyndication\.com/.test(home)) issues.push("Unexpected ad script before activation.");

if (issues.length) {
  console.error(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`PASS: ${posts.length} articles (minimum ${Math.min(...posts.map((post) => post.chars))} visible characters), linked references, internal resources, author schema, ${listingFiles.length} listing pages, contact and AdSense verification state.`);
}
