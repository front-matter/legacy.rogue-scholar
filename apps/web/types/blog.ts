import { FeedData } from '@extractus/feed-extractor';

export interface AuthorType {
  name: string;
  url?: string;
  avatar?: string;
}

export interface PostType {
  id: string;
  uuid?: string;
  url?: string;
  title?: string;
  summary?: string;
  date_published?: string;
  date_modified?: string;
  authors?: AuthorType[];
  image?: string;
  content_html?: string;
  tags?: string[];
  language?: string;
  blog_id?: string;
  blog?: BlogType;
}

export interface BlogType extends FeedData {
  version?: string;
  id?: string;
  title?: string;
  category?: string;
  description?: string;
  language?: string;
  base_url?: string;
  home_page_url?: string;
  feed_url?: string;
  favicon?: string;
  modified_at?: string;
  indexed_at?: string;
  generator?: string;
  license?: string;
  feed_format?: string;
  items?: PostType[];
  expired?: boolean;
  backlog?: boolean;
  prefix?: string;
}