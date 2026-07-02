import fs from "node:fs";
import path from "node:path";
import { localPosts } from "./local-posts.js";

const API_URL = (import.meta.env.WORDPRESS_API_URL || "https://cms.petnutritionguide.com/wp-json/wp/v2").replace(/\/$/, "");
const HAS_WORDPRESS_API = Boolean(import.meta.env.WORDPRESS_API_URL);
const MARKDOWN_BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

function mergePosts(remotePosts = []) {
  const remoteSlugs = new Set(remotePosts.map((post) => post.slug));
  const fallbackPosts = getLocalPosts().filter((post) => !remoteSlugs.has(post.slug));
  return [...fallbackPosts, ...remotePosts];
}

function getLocalPosts() {
  return [...getMarkdownPosts(), ...localPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getMarkdownPosts() {
  if (!fs.existsSync(MARKDOWN_BLOG_DIR)) {
    return [];
  }

  return fs
    .readdirSync(MARKDOWN_BLOG_DIR)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const filePath = path.join(MARKDOWN_BLOG_DIR, fileName);
      return markdownToPost(filePath, fs.readFileSync(filePath, "utf8"));
    });
}

function markdownToPost(filePath, raw) {
  const slug = path.basename(filePath, ".md");
  const { frontmatter, body } = parseFrontmatter(raw);
  const title = frontmatter.title || slug;
  const description = frontmatter.description || "";
  const category = frontmatter.category || "반려동물 영양";
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
  const thumbnail = frontmatter.thumbnail || "";

  return {
    id: `content-${slug}`,
    slug,
    date: `${frontmatter.pubDate || new Date().toISOString().slice(0, 10)}T00:00:00`,
    title: { rendered: title },
    excerpt: { rendered: description },
    content: { rendered: markdownToHtml(body) },
    _embedded: {
      "wp:featuredmedia": thumbnail.startsWith("/")
        ? [{ source_url: thumbnail, alt_text: title }]
        : [],
      "wp:term": [[{ name: category }], tags.map((name) => ({ name }))],
    },
  };
}

function parseFrontmatter(raw = "") {
  const match = String(raw).match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: raw };
  }

  const frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    frontmatter[key] = parseYamlValue(value);
  }

  return { frontmatter, body: match[2] };
}

function parseYamlValue(value) {
  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner
      .split(",")
      .map((item) => item.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }

  return value.replace(/^["']|["']$/g, "");
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineMarkdown(value = "") {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function markdownToHtml(markdown = "") {
  const lines = String(markdown).split(/\r?\n/);
  const html = [];
  let paragraph = [];
  let listOpen = false;
  let inCode = false;
  let codeLines = [];

  const closeParagraph = () => {
    if (paragraph.length > 0) {
      html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };

  const closeList = () => {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  };

  for (const line of lines) {
    if (line.startsWith("```") || line.startsWith("~~~")) {
      closeParagraph();
      closeList();
      if (inCode) {
        html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        codeLines = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (!line.trim()) {
      closeParagraph();
      closeList();
      continue;
    }

    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      closeParagraph();
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      closeParagraph();
      closeList();
      html.push(`<img src="${escapeHtml(image[2])}" alt="${escapeHtml(image[1])}" loading="lazy" />`);
      continue;
    }

    const listItem = line.match(/^\s*[-*]\s+(.+)$/);
    const checkboxItem = line.match(/^\s*-\s+\[[ xX]\]\s+(.+)$/);
    if (listItem || checkboxItem) {
      closeParagraph();
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${inlineMarkdown((checkboxItem || listItem)[1])}</li>`);
      continue;
    }

    if (line.startsWith("> ")) {
      closeParagraph();
      closeList();
      html.push(`<blockquote>${inlineMarkdown(line.slice(2))}</blockquote>`);
      continue;
    }

    paragraph.push(line.trim());
  }

  closeParagraph();
  closeList();

  if (inCode) {
    html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  }

  return html.join("\n");
}

async function fetchJson(path) {
  try {
    const response = await fetch(`${API_URL}${path}`);

    if (!response.ok) {
      console.warn(`[WordPress] 요청 실패: ${response.status} ${response.statusText} (${path})`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn(`[WordPress] API에 연결할 수 없습니다. .env의 WORDPRESS_API_URL을 확인하세요. (${path})`, error?.message || error);
    return null;
  }
}

export async function getPosts({ perPage = 12 } = {}) {
  if (!HAS_WORDPRESS_API) {
    return getLocalPosts().slice(0, perPage);
  }

  const posts = await fetchJson(`/posts?_embed&per_page=${perPage}`);
  return mergePosts(Array.isArray(posts) ? posts : []).slice(0, perPage);
}

export async function getPostBySlug(slug) {
  const localPost = getLocalPosts().find((post) => post.slug === slug);
  if (localPost) {
    return localPost;
  }

  if (!HAS_WORDPRESS_API) {
    return null;
  }

  const posts = await fetchJson(`/posts?slug=${encodeURIComponent(slug)}&_embed`);
  return Array.isArray(posts) && posts.length > 0 ? posts[0] : null;
}

export async function getCategories() {
  const categories = await fetchJson("/categories");
  return Array.isArray(categories) ? categories : [];
}

export async function getTags() {
  const tags = await fetchJson("/tags");
  return Array.isArray(tags) ? tags : [];
}

export function getFeaturedImage(post) {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  if (!media?.source_url) {
    return null;
  }

  return {
    url: media.source_url,
    alt: media.alt_text || stripHtml(post?.title?.rendered || ""),
  };
}

export function getPostCategories(post) {
  const terms = post?._embedded?.["wp:term"]?.[0] || [];
  return terms.map((term) => term.name).filter(Boolean);
}

export function getPostTags(post) {
  const terms = post?._embedded?.["wp:term"]?.[1] || [];
  return terms.map((term) => term.name).filter(Boolean);
}

export function stripHtml(html = "") {
  return String(html)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeHtml(html = "") {
  return String(html)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<\/?(object|embed|link|meta)[^>]*>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/\s(href|src)=["']javascript:[^"']*["']/gi, "");
}

export function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(dateString));
}
