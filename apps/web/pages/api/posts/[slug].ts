import { supabase, postsSelect } from '@/lib/supabaseClient';
import { supabaseAdmin } from '@/lib/server/supabase-admin';
import { PostType } from '@/types/blog';

export async function upsertSinglePost(post: PostType) {
  const { data, error } = await supabaseAdmin.from('posts').upsert({
    authors: post.authors,
    blog_id: post.blog_id,
    content_html: post.content_html,
    date_modified: post.date_modified,
    date_published: post.date_published,
    date_indexed: new Date().toISOString(),
    image: post.image,
    language: post.language,
    references: post.references,
    summary: post.summary,
    tags: post.tags,
    title: post.title,
    url: post.url,
  }, { onConflict: 'url' });

  if (error) {
    throw error;
  }

  return data;
}

export async function updateSinglePost(post: PostType) {
  const { data, error } = await supabaseAdmin.from('posts').update({
    authors: post.authors,
    blog_id: post.blog_id,
    content_html: post.content_html,
    date_modified: post.date_modified,
    date_published: post.date_published,
    date_indexed: new Date().toISOString(),
    image: post.image,
    language: post.language,
    references: post.references,
    summary: post.summary,
    tags: post.tags,
    title: post.title,
  }).eq('url', post.url);

  if (error) {
    throw error;
  }

  return data;
}

export default async function handler(req, res) {
  let { data: post } = await supabase.from('posts').select(postsSelect).eq('uuid', req.query.slug).single()
  
  res.status(200).json(post);
}