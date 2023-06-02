import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string)

export const blogsSelect = 'id, title, description, language, icon, favicon, feed_url, feed_format, homepage_url, indexed_at, license, generator, category'

export const postsSelect = 'id, doi, url, title, description, published_at, modified_at, authors, image, thumbnail, content_html, tags, language, blog_id, blogs (id, title, description, language, icon, favicon, feed_url, feed_format, homepage_url, indexed_at, license, generator, category)'

export const blogWithPostsSelect = 'id, title, description, language, icon, favicon, feed_url, feed_format, homepage_url, indexed_at, license, generator, category, items: posts (id, doi, url, title, description, published_at, modified_at, authors, image, thumbnail, content_html, tags, language, blog_id)'
