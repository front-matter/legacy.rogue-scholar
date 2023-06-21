import { extract } from '@extractus/feed-extractor';
import { get, isArray, isObject, isString, uniq, pick } from 'lodash';
const extractUrls = require("extract-urls");
import normalizeUrl from 'normalize-url';

import { upsertSinglePost, updateSinglePost } from '@/pages/api/posts/[slug]';
import { getSingleBlog } from '@/pages/api/blogs/[slug]';
import { getAllConfigs } from '@/pages/api/blogs';
import { BlogType, PostType, AuthorType } from '@/types/blog';
import { isDoi } from '../posts';

export const authorIDs = {
  "Roderic Page": "https://orcid.org/0000-0002-7101-9767",
  "Liberate Science": "https://ror.org/0342dzm54"
}

export const isOrcid = (orcid: any) => {
  try {
    return new URL(orcid).hostname === 'orcid.org';
  } catch (error) {
    return false;
  }
};

const isRor = (ror: any) => {
  try {
    return new URL(ror).hostname === 'ror.org';
  } catch (error) {
    return false;
  }
};

// from https://stackoverflow.com/questions/784586/convert-special-characters-to-html-in-javascript
const decodeHtmlCharCodes = (str: string) => 
  str.replace(/(&#(\d+);)/g, (_match, _capture, charCode) => 
    String.fromCharCode(charCode));

const getReferences = (content_html: string) => {
  // extract links from references section,defined as the text after the tag 
  // "References</h2>", "References</h3>" or "References</h4>
  let reference_html = content_html.split(/References<\/(?:h2|h3|h4)>/, 2);
  if (reference_html.length == 1) {
    return [];
  }
  // strip optional text after references, using <hr>, <hr />, <h2, <h3, <h4 as tag
  reference_html[1] = reference_html[1].split(/(?:<hr \/>|<hr>|<h2|<h3|<h4)/, 2)[0];
  let urls = extractUrls(reference_html[1]);
  if (!urls || urls.length == 0) {
    return [];
  }
  urls = urls.map((url) => {
    url = normalizeUrl(url, { removeQueryParameters: ['ref', 'referrer', 'origin', 'utm_content', 'utm_medium', 'utm_source'] })
    url = isDoi(url) ? url.toLowerCase() : url;
    return url;
  });
  urls = uniq(urls);
  urls = urls.map((url, index) => {
    let doi = isDoi(url)
    if (doi) { 
      return {
        key: `ref${index + 1}`,
        doi: url,
      };
    } else {
      return {
        key: `ref${index + 1}`,
        url: url,
      };
    }
  });
  return urls;
};

// from @extractus/feed-extractor
const toISODateString = (dstr) => {
  try {
    return dstr ? new Date(dstr).toISOString().split('.')[0] + 'Z' : null;
  } catch (err) {
    return '';
  }
};

export async function getAllUpdatedPosts(allPosts: boolean = false) {
  const configs = await getAllConfigs();
  let posts = await Promise.all(configs.map((config) => getUpdatedPosts(config.id, allPosts)));
  posts = posts.flat();
  posts = posts.map((post) => {
    post.summary = post.description;
    return post;
  });
  if (allPosts) {
    await Promise.all(posts.map(post => updateSinglePost(post)));
  } else {
    await Promise.all(posts.map(post => upsertSinglePost(post)));
  }
  return posts;
}

export async function getUpdatedPosts(blogSlug: string, allPosts: boolean = false) {
  const blog: BlogType = await getSingleBlog(blogSlug);

  let blogWithPosts = await extract(blog.feed_url as string, {
    useISODateFormat: true,
    descriptionMaxLen: 500,
    getExtraEntryFields: (feedEntry) => {
      let author: any = get(feedEntry, 'author', null) || get(feedEntry, 'dc:creator', []);
      if (isString(author)) {
        author = {
          name: author,
          uri: null,
        };
      }
      if (!isArray(author)) {
        author = [author];
      }
      const authors = author.map((auth) => {
        let url = authorIDs[auth['name']] || null;
        url ??= isOrcid(get(auth, 'uri', null)) ? get(auth, 'uri') : null || isRor(get(auth, 'uri', null)) ? get(auth, 'uri') : null;
        return {
          name: get(auth, 'name', null),
          url: url,
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
      const references = content_html ? getReferences(content_html) : [];
      const tags = [].concat(get(feedEntry, 'category', []))
        .map((tag) => get(tag, '@_term', null) || get(tag, '#text', null) || tag)
        .slice(0, 5);
      let title = get(feedEntry, 'title.#text', null) || get(feedEntry, 'title', null) || '';
      title = decodeHtmlCharCodes(title).trim();
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
        references,
        tags,
        title,
        url,
      };
    },
  });
  
  let posts : PostType[] = blogWithPosts['entries'] || [];
  return posts.filter((post) => {
    return (post.date_published as string) > (allPosts ? '1970-01-01' : blog.modified_at as string);
  });
};


export default async function handler(req, res) {
  if (!req.headers.authorization || req.headers.authorization.split(' ')[1] !== process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) {
    res.status(401).json({ message: 'Unauthorized' });
  } else if (req.method === 'POST') {
    const posts = await getAllUpdatedPosts();
    res.status(200).json(posts);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}