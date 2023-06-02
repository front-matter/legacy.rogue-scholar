import { extract } from '@extractus/feed-extractor';
import { get, isArray, isObject } from 'lodash';

import { supabaseAdmin } from '@/lib/server/supabase-admin';
import { supabase, postsSelect } from '@/lib/supabaseClient';
import { hashids } from '@/utils/helpers';
import { PostType } from '@/types/blog';

// from @extractus/feed-extractor
const toISODateString = (dstr) => {
  try {
    return dstr ? new Date(dstr).toISOString().split('.')[0] + 'Z' : null;
  } catch (err) {
    return '';
  }
};

const isOrcid = (orcid: any) => {
  try {
    return new URL(orcid).hostname === 'orcid.org';
  } catch (error) {
    return false;
  }
};

export const isDoi = (doi: any) => {
  try {
    return new URL(doi).hostname === 'doi.org';
  } catch (error) {
    return false;
  }
};

export async function getAllPosts() {
  let { data, error } = await supabase.from('posts').select(postsSelect).range(0, 24).order('published_at', { ascending: false })

  if (error) {
    console.log(error);
  } 
  if (data) {
    return data.map(post => {
      post.id = '/posts/' + hashids.encode(post.id);
      return post;
    })
  }
};

export async function getPosts(blogSlug: string) {
  let { data, error } = await supabase.from('posts').select(postsSelect).eq('blog_id', blogSlug).order('published_at', { ascending: false })

  if (error) {
    console.log(error);
  }

  if (data) {
    return data.map(post => {
      post.id = '/posts/' + hashids.encode(post.id);
      return post;
    })
  }
};

export async function generatePosts(feed_url: string, blog_id: string) {
  try {
    let blog = {}
    blog = await extract(feed_url, {
      getExtraEntryFields: (feedEntry) => {
        // console.log(feedEntry)
        const author = get(feedEntry, 'author', null) || get(feedEntry, 'dc:creator', []);
        const authors = [].concat(author).map((author) => {
          return {
            name: get(author, 'name', null) || author,
            url: isOrcid(get(author, 'uri', null)) ? get(author, 'uri', null) : null,
          };
        });
        const id =
          get(feedEntry, 'id.#text', null) ||
          get(feedEntry, 'guid.#text', null) ||
          get(feedEntry, 'id', null) ||
          get(feedEntry, 'guid', null);

        let url: any = get(feedEntry, 'link', []);

        if (isArray(url) && url.length > 0) {
          url = url.find((link) => get(link, '@_rel', null) === 'alternate');
          url = get(url, '@_href', null);
        }
        if (isObject(url)) {
          url = get(url, '@_href', null);
        }

        const tags = [].concat(get(feedEntry, 'category', []))
          .map((tag) => get(tag, '@_term', null) || get(tag, '#text', null) || tag)
          .slice(0, 5);
        const image = get(feedEntry, 'media:content.@_url', null) || get(feedEntry, 'enclosure.@_url', null);
        const thumbnail = get(feedEntry, 'media:thumbnail.@_url', null);
        const published_at = toISODateString(get(feedEntry, 'pubDate', null) || get(feedEntry, 'published', null));
        const modified_at = toISODateString(get(feedEntry, 'updated', null));
        const content_html =
          get(feedEntry, 'content:encoded', null) ||
          get(feedEntry, 'content.#text', null) ||
          get(feedEntry, 'description', null);

        return {
          id,
          url,
          tags,
          authors,
          image,
          thumbnail,
          published_at,
          modified_at,
          content_html
        };
      },
    });
    blog['entries'].forEach(post => upsertPost(post, blog_id)) 

    return blog['entries'];
  } catch (error) {
    console.error(error);
  }
}

export async function upsertPost(post: PostType, blog_id: string) {
  const { data, error } = await supabaseAdmin.from('posts').upsert({
    doi: isDoi(post.id) ? post.id : null,
    title: post.title,
    description: post.description,
    url: post.url,
    tags: post.tags,
    authors: post.authors,
    image: post.image,
    thumbnail: null,
    published_at: post.published_at,
    modified_at: post.modified_at,
    content_html: post.content_html,
    blog_id: blog_id,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function getPost(postSlug: string) {
  const postId = hashids.decode(postSlug);
  let { data, error } = await supabase.from('posts').select(postsSelect).eq('id', postId)

  if (error) {
    console.log(error);
  }

  if (!data || data.length === 0) {
    return null;
  }

  return data[0];
}

export default async function handler(_, res) {
  let posts = await getAllPosts();

  res.statusCode = 200;
  res.json(posts);
};
