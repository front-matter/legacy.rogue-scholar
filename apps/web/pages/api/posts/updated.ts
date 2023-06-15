import { supabase, postsSelect } from '@/lib/supabaseClient';

export default async function handler(_, res) {
  let { data: posts, error } = await supabase.from('posts').select(postsSelect).gt('date_published', 'blogs.modified_at').limit(30) 

  if (error) {
    console.log(error);
  }
  
  res.status(200).json(posts);
}
