import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string)

export const blogsSelect = 'id, title, description, language, icon, favicon, feed_url, feed_format, home_page_url, indexed_at, license, generator, category'

export const postsSelect = 'id, uuid, url, title, summary, date_published, date_modified, authors, image, content_html, tags, language, blog_id, blog: blogs (id, title, language, favicon, feed_url, home_page_url, license, category)'

export const blogWithPostsSelect = 'id, title, description, language, icon, favicon, feed_url, feed_format, home_page_url, indexed_at, license, generator, category, items: posts (id, uuid, url, title, summary, date_published, date_modified, authors, image, content_html, tags, language)'
