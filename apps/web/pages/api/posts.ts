import Cors from 'cors'

import { supabaseAdmin } from '@/lib/server/supabase-admin';
import { supabase, postsSelect } from '@/lib/supabaseClient';
import { PostType } from '@/types/blog';

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export const initMiddleware = (middleware) => {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
}

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'OPTIONS']
  })
)

export const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const from = page ? page * limit : 0;
  const to = page ? from + size : size;

  return { from, to };
};

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

export default async function handler(req, res) {
  // const query = req.query.query as string
  const page = req.query.page as number || 0;
  const { from, to } = getPagination(page, 15);
  
  let { data: posts, error } = await supabase.from('posts')
    .select(postsSelect)
    .range(from, to)
    .order('date_published', { ascending: false });

  if (error) {
    console.log(error);
  }
  
  res.statusCode = 200;
  res.json(posts);
};
