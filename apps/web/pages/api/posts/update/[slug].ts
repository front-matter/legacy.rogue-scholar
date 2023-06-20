import { getUpdatedPosts } from '@/pages/api/posts/update'
import { upsertSinglePost } from '@/pages/api/posts/[slug]'

export default async function handler(req, res) {
  if (!req.headers.authorization || req.headers.authorization.split(' ')[1] !== process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) {
    res.status(401).json({ message: 'Unauthorized' });
  } else if (req.method === 'POST') {
    let posts = await getUpdatedPosts(req.query.slug);
    posts = posts.map((post) => {
      post.summary = post['description'];
      return post;
    });
    await Promise.all(posts.map(post => upsertSinglePost(post)));
    res.status(200).json(posts);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}