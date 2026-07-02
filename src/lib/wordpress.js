import { localPosts } from "./local-posts.js";

const API_URL = (import.meta.env.WORDPRESS_API_URL || "https://cms.petnutritionguide.com/wp-json/wp/v2").replace(/\/$/, "");
const HAS_WORDPRESS_API = Boolean(import.meta.env.WORDPRESS_API_URL);

function mergePosts(remotePosts = []) {
  const remoteSlugs = new Set(remotePosts.map((post) => post.slug));
  const fallbackPosts = localPosts.filter((post) => !remoteSlugs.has(post.slug));
  return [...fallbackPosts, ...remotePosts];
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
    return localPosts.slice(0, perPage);
  }

  const posts = await fetchJson(`/posts?_embed&per_page=${perPage}`);
  return mergePosts(Array.isArray(posts) ? posts : []).slice(0, perPage);
}

export async function getPostBySlug(slug) {
  const localPost = localPosts.find((post) => post.slug === slug);
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
