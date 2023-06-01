import { extract, FeedData } from '@extractus/feed-extractor';
// import Ajv, { DefinedError, JSONSchemaType } from 'ajv'
import { capitalize, get, isArray, isObject, mapKeys, omit, snakeCase } from 'lodash';

import { supabase, blogsSelect, postsSelect } from '@/lib/supabaseClient';
import { BlogType, PostType } from '@/types/blog';

const itemKeys = {
  description: 'summary',
  published: 'datePublished',
};

// from @extractus/feed-extractor
const toISODateString = (dstr) => {
  try {
    return dstr ? new Date(dstr).toISOString().split('.')[0] + 'Z' : null;
  } catch (err) {
    return '';
  }
};

export const isDoi = (doi: any) => {
  try {
    return new URL(doi).hostname === 'doi.org';
  } catch (error) {
    return false;
  }
};

const isOrcid = (orcid: any) => {
  try {
    return new URL(orcid).hostname === 'orcid.org';
  } catch (error) {
    return false;
  }
};

const isString = (str: any) => {
  return typeof str === 'string' || str instanceof String ? true : false;
};

const parseGenerator = (generator: any) => {
  if (isObject(generator)) {
    let name = generator['#text'];

    if (name === 'WordPress.com') {
      name = 'WordPress (.com)';
    } else if (name === 'Wordpress') {
      // versions prior to 6.1
      name = 'WordPress';
    }
    const version = generator['@_version'];

    return name + (version ? ' ' + version : '');
  } else if (isString(generator)) {
    if (generator === 'Wowchemy (https://wowchemy.com)') {
      return 'Hugo';
    }
    try {
      const url = new URL(generator);

      if (url.hostname === 'wordpress.org') {
        const name = 'WordPress';
        const version = url.searchParams.get('v');

        return name + (version ? ' ' + version : '');
      } else if (url.hostname === 'wordpress.com') {
        const name = 'WordPress (.com)';

        return name;
      }
    } catch (error) {
      // console.log(error)
    }
    generator = generator.replace(/^(\w+)(.+)(-?v?\d{1,2}\.\d{1,2}\.\d{1,3})$/gm, '$1 $3');
    return capitalize(generator);
  } else {
    return null;
  }
};

export async function getSingleBlog(blogSlug: string) {
  let { data, error } = await supabase.from('blogs').select(blogsSelect).eq('id', blogSlug)

  if (error) {
    console.log(error);
  }

  if (!data || data.length === 0) {
    return null;
  }

  let blog: BlogType = data[0];

  return blog;
}

export async function getPosts(blogSlug: string) {
  let { data, error } = await supabase.from('posts').select(postsSelect).eq('blog_id', blogSlug)

  if (error) {
    console.log(error);
  }

  if (!data || data.length === 0) {
    return null;
  }

  let posts: PostType[] = data;

  return posts;
}

export default async function handler(req, res) {
  let blog = await getSingleBlog(req.query.slug);
  let posts = await getPosts(req.query.slug);
  const host = req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'http';

  // blog.id = `${protocol}://${host}/${blog.id}`;

  if (blog && posts) {
    blog.items = posts
  }

  res.status(200).json(blog);
}
