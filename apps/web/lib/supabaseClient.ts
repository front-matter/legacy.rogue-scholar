import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string)

export const blogsSelect = 'id, title, description, language, favicon, feed_url, feed_format, home_page_url, indexed_at, modified_at, license, generator, category, backlog, prefix'

export const postsSelect = 'id, uuid, url, title, summary, date_published, date_modified, date_indexed, authors, image, content_html, tags, language, references, blog_id, blog: blogs!inner(*)'

export const blogWithPostsSelect = 'id, title, description, language, favicon, feed_url, feed_format, home_page_url, indexed_at, modified_at, license, generator, category, backlog, prefix, items: posts (id, uuid, url, title, summary, date_published, date_modified, date_indexed, authors, image, content_html, tags, language, references)'
