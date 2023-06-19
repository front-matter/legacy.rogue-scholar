import { supabaseAdmin } from '@/lib/server/supabase-admin';
import { supabase, postsSelect } from '@/lib/supabaseClient';
import { PostType } from '@/types/blog';

export const isDoi = (doi: any) => {
  try {
    return new URL(doi).hostname === 'doi.org';
  } catch (error) {
    return false;
  }
};

export async function getPosts(blogSlug: string) {
  let { data, error } = await supabase.from('posts').select(postsSelect).eq('blog_id', blogSlug).order('date_published', { ascending: false })

  if (error) {
    console.log(error);
  }

  if (data) {
    return data;
  }
};

export default async function handler(_, res) {
  let { data: posts, error } = await supabase.from('posts').select(postsSelect).range(0, 24).order('date_published', { ascending: false })

  if (error) {
    console.log(error);
  }
  
  res.statusCode = 200;
  res.json(posts);
};
