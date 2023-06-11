import { extract } from '@extractus/feed-extractor';
import { get, isArray, isObject } from 'lodash';

import { upsertSinglePost } from '@/pages/api/posts/[slug]';
import { getSingleBlog } from '@/pages/api/blogs/[slug]';
import { getAllConfigs } from '@/pages/api/blogs';
import { BlogType, PostType } from '@/types/blog';

const isOrcid = (orcid: any) => {
  try {
    return new URL(orcid).hostname === 'orcid.org';
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

export async function getAllUpdatedPosts() {
  const configs = await getAllConfigs();
  let posts = await Promise.all(configs.map((config) => getUpdatedPosts(config.id)));
  posts = posts.flat();
  posts = posts.map((post) => {
    post.summary = post.description;
    return post;
  });
  await Promise.all(posts.map(post => upsertSinglePost(post)));
  return posts;
}

export async function getUpdatedPosts(blogSlug: string) {
  const blog: BlogType = await getSingleBlog(blogSlug);

  let blogWithPosts = await extract(blog.feed_url as string, {
    useISODateFormat: true,
    getExtraEntryFields: (feedEntry) => {
      // (feedEntry)
      const author = get(feedEntry, 'author', null) || get(feedEntry, 'dc:creator', []);
      const authors = [].concat(author).map((author) => {
        return {
          name: get(author, 'name', null) || author,
          url: isOrcid(get(author, 'uri', null)) ? get(author, 'uri', null) : null,
        };
      });
      const blog_id = blog.id;
      const content_html =
        get(feedEntry, 'content:encoded', null) ||
        get(feedEntry, 'content.#text', null) ||
        get(feedEntry, 'description', null);
      const date_modified = toISODateString(get(feedEntry, 'updated', null));
      const date_published = toISODateString(get(feedEntry, 'pubDate', null) || get(feedEntry, 'published', null));
      const id =
        get(feedEntry, 'id.#text', null) ||
        get(feedEntry, 'guid.#text', null) ||
        get(feedEntry, 'id', null) ||
        get(feedEntry, 'guid', null);
      const image = get(feedEntry, 'media:content.@_url', null) || get(feedEntry, 'enclosure.@_url', null);
      const language = get(feedEntry, 'dc:language', null) || get(feedEntry, 'language', null) || blog.language;
      const tags = [].concat(get(feedEntry, 'category', []))
        .map((tag) => get(tag, '@_term', null) || get(tag, '#text', null) || tag)
        .slice(0, 5);
      const title = get(feedEntry, 'title.#text', null) || get(feedEntry, 'title', null);
      let url: any = get(feedEntry, 'link', []);
      
      if (isArray(url) && url.length > 0) {
        url = url.find((link) => get(link, '@_rel', null) === 'alternate');
        url = get(url, '@_href', null);
      }
      if (isObject(url)) {
        url = get(url, '@_href', null);
      }

      return {
        authors,
        blog_id,
        content_html,
        date_modified,
        date_published,
        id,
        image,
        language,
        tags,
        title,
        url,
      };
    },
  });

  let posts : PostType[] = blogWithPosts['entries'] || [];
  return posts.filter((post) => {
    return (post.date_published as string) > (blog.modified_at as string);
  });
};


export default async function handler(req, res) {
  if (!req.headers.authorization || req.headers.authorization.split(' ')[1] !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    res.status(401).json({ message: 'Unauthorized' });
  } else if (req.method === 'POST') {
    const posts = await getAllUpdatedPosts();
    res.status(200).json(posts);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}