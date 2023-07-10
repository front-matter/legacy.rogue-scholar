import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export const blogsSelect =
  "id, title, description, language, favicon, feed_url, current_feed_url, feed_format, home_page_url, indexed_at, modified_at, license, generator, category, backlog, prefix, expired"
export const blogWithPostsSelect =
  "id, title, description, language, favicon, feed_url, current_feed_url, feed_format, home_page_url, indexed_at, modified_at, license, generator, category, backlog, prefix, expired, items: posts (id, doi, url, title, summary, published_at, updated_at, indexed_at, authors, image, tags, language, reference)"
export const postsSelect =
  "id, doi, url, title, summary, published_at, updated_at, indexed_at, authors, image, tags, language, reference, blog_id, blog_name"
export const postsWithBlogSelect =
  "id, doi, url, title, summary, published_at, updated_at, indexed_at, authors, image, tags, language, reference, blog_id, blog_name, blog: blogs!inner(*)"
