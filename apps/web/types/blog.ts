import { FeedData } from '@extractus/feed-extractor';

export interface AuthorType {
  name: string;
  url?: string;
  avatar?: string;
}

export interface PostType {
  id?: string;
  url?: string;
  title?: string;
  summary?: string;
  datePublished?: string;
  dateModified?: string;
  authors?: AuthorType[];
  image?: string;
  thumbnail?: string;
  contentHtml?: string;
  contentText?: string;
  tags?: string[];
  language?: string;
  issn?: string;
}

export interface BlogType extends Omit<FeedData, 'entries' | 'published' | 'link'> {
  version?: string;
  id?: string;
  title?: string;
  category?: string;
  description?: string;
  language?: string;
  baseUrl?: string;
  homePageUrl?: string;
  feedUrl?: string;
  icon?: string;
  favicon?: string;
  dateModified?: string;
  dateIndexed?: string;
  generator?: string;
  hasLicense?: boolean;
  license?: string;
  feedFormat?: string;
  items?: PostType[];
  expired?: boolean;
}