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

export function getSecret(secretName: string) {
  return supabase.rpc("read_secret", {
    secret_name: secretName,
  })
}

export const blogsSelect =
  "id, slug, title, description, language, favicon, feed_url, current_feed_url, archive_prefix,  feed_format, home_page_url, use_mastodon, created_at, updated_at, license, generator, category, backlog, prefix, status, plan, funding"
export const blogWithPostsSelect =
  "id, slug, title, description, language, favicon, feed_url, current_feed_url, archive_prefix, feed_format, home_page_url, use_mastodon, created_at, updated_at, license, generator, category, backlog, prefix, status, plan, funding, items: posts (uuid, doi, url, archive_url, title, summary, published_at, updated_at, indexed_at, authors, image, tags, language, reference)"
export const postsSelect =
  "uuid, doi, url, archive_url, title, summary, published_at, updated_at, indexed_at, authors, image, tags, language, reference, relationships, blog_id, blog_name, blog_slug"
export const postsWithBlogSelect =
  "uuid, doi, url, archive_url, title, summary, published_at, updated_at, indexed_at, authors, image, tags, language, reference, relationships, blog_id, blog_name, blog_slug, blog: blogs!inner(*)"
export const postsWithContentSelect =
  "uuid, doi, url, archive_url, title, summary, content_html, published_at, updated_at, indexed_at, authors, image, tags, language, reference, relationships, blog_id, blog_name, blog_slug, blog: blogs!inner(*)"
