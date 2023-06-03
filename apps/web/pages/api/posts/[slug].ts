import { supabase, postsSelect } from '@/lib/supabaseClient';
import { hashids } from '@/utils/helpers';

export async function getSinglePost(postSlug: string) {
  let { data, error } = await supabase.from('posts').select(postsSelect).eq('short_id', hashids.decode(postSlug)).single()

  if (error) {
    console.log(error);
  }

  if (!data) {
    return null;
  }

  data.short_id = hashids.encode(data.short_id);
  return data;
}

export default async function handler(req, res) {
  let post = await getSinglePost(req.query.slug);

  if (!post) {
    return null;
  }
  
  res.status(200).json(post);
}