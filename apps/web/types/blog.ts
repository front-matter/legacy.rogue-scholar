import { FeedData } from '@extractus/feed-extractor';

export interface AuthorType {
  name: string;
  url?: string;
  avatar?: string;
}

export interface PostType {
  id?: string;
  doi?: string;
  url: string;
  title: string;
  description?: string;
  published_at: string;
  modified_at?: string;
  authors?: AuthorType[];
  image?: string;
  thumbnail?: string;
  content_html?: string;
  content_text?: string;
  tags?: string[];
  language?: string;
  blog_id: string;
  blogs?: BlogType;
}

export interface BlogType extends Omit<FeedData, 'entries' | 'published' | 'link'> {
  version?: string;
  id?: string;
  title?: string;
  category?: string;
  description?: string;
  language?: string;
  base_url?: string;
  homepage_url?: string;
  feed_url?: string;
  icon?: string;
  favicon?: string;
  modified_at?: string;
  indexed_at?: string;
  generator?: string;
  has_license?: boolean;
  license?: string;
  feed_format?: string;
  items?: PostType[];
  expired?: boolean;
}