import { supabase, blogsSelect } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  let { data, error } = await supabase.from('blogs').select(blogsSelect).gt("modified_at", "1969-01-01").limit(50) 

  if (error) {
    console.log(error);
  }

  const post = data;
  
  res.status(200).json(post);
}