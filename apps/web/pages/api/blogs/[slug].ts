import { capitalize, isObject } from 'lodash';

import { supabase, blogWithPostsSelect } from '@/lib/supabaseClient';
import { BlogType } from '@/types/blog';

export const isDoi = (doi: any) => {
  try {
    return new URL(doi).hostname === 'doi.org';
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
  let { data, error } = await supabase.from('blogs').select(blogWithPostsSelect).eq('id', blogSlug).single();

  if (error) {
    console.log(error);
  }

  if (!data) {
    return null;
  }

  let blog: BlogType = data;
  blog.id = '/blogs/' + blog.id;

  return blog;
}

export default async function handler(req, res) {
  let blog = await getSingleBlog(req.query.slug);

  if (!blog) {
    return null;
  }
  
  res.status(200).json(blog);
}
