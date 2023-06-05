import { supabase, postsSelect } from '@/lib/supabaseClient';

export async function getSinglePost(postSlug: string) {
  let { data, error } = await supabase.from('posts').select(postsSelect).eq('uuid', postSlug).single()

  if (error) {
    console.log(error);
  }

  if (!data) {
    return null;
  }

  return data;
}

export default async function handler(req, res) {
  let post = await getSinglePost(req.query.slug);

  if (!post) {
    return null;
  }
  
  res.status(200).json(post);
}