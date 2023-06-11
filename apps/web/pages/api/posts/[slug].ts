import { supabase, postsSelect } from '@/lib/supabaseClient';
import { getUpdatedPosts } from '@/pages/api/posts/update';
import { supabaseAdmin } from '@/lib/server/supabase-admin';
import { PostType } from '@/types/blog';

export async function upsertSinglePost(post: PostType) {
  const { data, error } = await supabaseAdmin.from('posts').upsert({
    authors: post.authors,
    blog_id: post.blog_id,
    content_html: post.content_html,
    date_modified: post.date_modified,
    date_published: post.date_published,
    id: post.id,
    image: post.image,
    language: post.language,
    summary: post.summary,
    tags: post.tags,
    title: post.title,
    url: post.url,
  });

  if (error) {
    throw error;
  }

  return data;
}

export default async function handler(req, res) {
  // let { data, error } = await supabase.from('posts').select(postsSelect).eq('uuid', req.query.slug).single()

  const posts = await getUpdatedPosts(req.query.slug);
  
  res.status(200).json(posts);
}