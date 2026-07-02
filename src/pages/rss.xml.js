import rss from "@astrojs/rss";
import { getPosts, stripHtml } from "../lib/wordpress.js";

export async function GET(context) {
  const posts = await getPosts({ perPage: 50 });
  const site = context.site || new URL("https://mycompanionpet.com");

  return rss({
    title: "Pet Nutrition Guide",
    description: "강아지와 고양이 보호자를 위한 반려동물 영양 정보",
    site,
    items: posts.map((post) => ({
      title: stripHtml(post.title?.rendered || ""),
      description: stripHtml(post.excerpt?.rendered || ""),
      pubDate: new Date(post.date),
      link: `/blog/${post.slug}`,
    })),
  });
}
