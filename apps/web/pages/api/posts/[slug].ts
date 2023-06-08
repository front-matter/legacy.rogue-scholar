import { supabase, postsSelect } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  let { data, error } = await supabase.from('posts').select(postsSelect).eq('uuid', req.query.slug).single()

  if (error) {
    console.log(error);
  }

  const post = data;
  
  res.status(200).json(post);
}