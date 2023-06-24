import { get, capitalize, isObject, omit } from 'lodash';
import { extract } from '@extractus/feed-extractor';

import { supabase, blogWithPostsSelect } from '@/lib/supabaseClient';
import { supabaseAdmin } from '@/lib/server/supabase-admin';
import { BlogType } from '@/types/blog';
import { getAllConfigs } from '@/pages/api/blogs';

export const isDoi = (doi: any) => {
  try {
    return new URL(doi).hostname === 'doi.org';
  } catch (error) {
    return false;
  }
};

// from @extractus/feed-extractor
const toISODateString = (dstr) => {
  try {
    return dstr ? new Date(dstr).toISOString().split('.')[0] + 'Z' : null;
  } catch (err) {
    return '';
  }
};

const isString = (str: any) => {
  return typeof str === 'string' || str instanceof String ? true : false;
};

export async function upsertSingleBlog(blogSlug: string) {
  const blog : BlogType = await getSingleBlog(blogSlug);

  const { data, error } = await supabaseAdmin.from('blogs').upsert({
    id: blog.id,
    title: blog.title,
    description: blog.description,
    feed_url: blog.feed_url,
    home_page_url: blog.home_page_url,
    feed_format: blog.feed_format,
    indexed_at: blog.indexed_at,
    modified_at: blog.modified_at,
    language: blog.language,
    favicon: blog.favicon,
    license: blog.license,
    category: blog.category,
    generator: blog.generator,
    prefix: blog.prefix,
  });

  if (error) {
    throw error;
  }

  return data;
}

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
  const configs = await getAllConfigs();
  const config = configs.find((config) => config.id === blogSlug);
  const feed_url = config.complete_feed_url || config.feed_url

  let blog : BlogType = await extract(feed_url, {
    useISODateFormat: true,
    getExtraFeedFields: (feedData) => {
      // console.log(feedData)
      // required properties from config
      const id = config.id;
      const version = 'https://jsonfeed.org/version/1.1';
      const feed_url = config.feed_url;
      const category = config.category;
      const indexed_at = config.indexed_at;
      const title = (config.title || get(feedData, 'title.#text', null) || get(feedData, 'title', null)).trim();

      let home_page_url = [].concat(get(feedData, 'link', []))
        .find((link) => get(link, '@_rel', null) === 'alternate');

      home_page_url =
        config.home_page_url ||
        get(home_page_url, '@_href', null) ||
        get(feedData, 'id', null) ||
        get(feedData, 'link', null);

      let feed_format = [].concat(get(feedData, 'link', [])).find((link) => get(link, '@_rel', null) === 'self') || {};

      feed_format =
        get(feed_format, '@_type', null) || get(feedData, '@_xmlns', null) === 'http://www.w3.org/2005/Atom'
          ? 'application/atom+xml'
          : null || get(feedData, 'atom:link.@_type', null) || 'application/rss+xml';

      let generator = get(feedData, 'generator', null)

      generator = parseGenerator(generator) || config.generator;
      
      let description =
        get(feedData, 'description.#text', null) ||
        get(feedData, 'description', null) ||
        get(feedData, 'subtitle.#text', null) ||
        get(feedData, 'subtitle', null) ||
        config.description;

      description = isString(description) ? description.trim() : null;

      let language = get(feedData, 'language', null) || get(feedData, '@_xml:lang', null) || config.language;
      // normalize language to ISO 639-1, e.g. en-US -> en
      // en is the default language

      language = language ? language.split('-')[0] : 'en';

      let favicon = get(feedData, 'image.url', null) || config.favicon;

      favicon = favicon !== 'https://s0.wp.com/i/buttonw-com.png' ? favicon : null;

      const license =
        get(feedData, 'rights.#text', null)
          ? null
          : 'https://creativecommons.org/licenses/by/4.0/legalcode';
      const prefix = config.prefix;

      return {
        id,
        version,
        feed_url,
        home_page_url,
        feed_format,
        title,
        category,
        generator,
        description,
        favicon,
        language,
        license,
        indexed_at,
        prefix
      };
    }
  });
  let { data: posts } = await supabase.from('posts').select('date_published, blog_id').eq('blog_id', blog.id).order('date_published', { ascending: false });
  blog.modified_at = posts && posts.length > 0 ? posts[0].date_published : '1970-01-01T00:00:00Z';
  blog = omit(blog, ['published', 'link', 'entries']);
  return blog;
};

export default async function handler(req, res) {
  const { data } = await supabase.from('blogs').select(blogWithPostsSelect).eq('id', req.query.slug);
  
  if (data) {
    const blog = data[0];
    res.status(200).json(blog);
  } else {
    res.status(404).json({ message: 'Not Found' });
  }
}
