import { supabase, postsSelect } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  let { data: posts, error } = await supabase.from('posts').select(postsSelect).lt('date_indexed', req.query.slug).limit(15) 

  if (error) {
    console.log(error);
  }
  
  res.status(200).json(posts);
}
