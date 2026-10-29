export const postsPerPage = 18;

export function blogPageUrl(page) {
  return page === 1 ? "/blog/" : `/blog/page/${page}/`;
}

export function paginatePosts(posts, page = 1) {
  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date) || a.slug.localeCompare(b.slug));
  const totalPages = Math.max(1, Math.ceil(sorted.length / postsPerPage));
  if (!Number.isInteger(page) || page < 1 || page > totalPages) {
    throw new Error(`Invalid blog page: ${page}`);
  }
  return {
    posts: sorted.slice((page - 1) * postsPerPage, page * postsPerPage),
    page,
    totalPages,
    totalPosts: sorted.length,
  };
}
