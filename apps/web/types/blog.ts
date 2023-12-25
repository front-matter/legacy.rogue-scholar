import { FeedData } from "@extractus/feed-extractor"

export interface AuthorType {
  name: string
  url?: string
  email?: string
  avatar?: string
}

export interface ReferenceType {
  key?: string
  doi?: string
  url?: string
}

export interface FundingType {
  funder_id?: string
  funder_name?: string
  award_number?: string
  award_uri?: string
}

export interface RelationshipType {
  type?: string
  url?: string
}

export interface PaginationType {
  base_url?: string
  query?: string
  language?: string
  tags?: string
  category?: string
  generator?: string
  page: number
  pages: number
  total: number
  prev?: number
  next?: number
}

export interface TagType {
  name: string
}

export interface ImageType {
  src?: string
  srcset?: string
  width?: number
  height?: number
  sizes?: string
  alt?: string
}

export interface FundingType {
  funder_id?: string
  funder_name?: string
  award_number?: string
  award_uri?: string
}

export interface PostType {
  id: string
  guid?: string
  doi?: string
  url?: string
  archive_url?: string
  title?: string
  summary?: string
  published_at?: number
  updated_at?: number
  indexed_at?: number
  indexed?: boolean
  authors?: AuthorType[]
  image?: string
  content_text?: string
  reference?: ReferenceType[]
  relationships?: RelationshipType[]
  images?: string[]
  tags?: string[]
  language?: string
  category?: string
  blog_id?: string
  blog_name?: string
  blog_slug?: string
  blog?: BlogParentType
}

export interface BlogType extends FeedData {
  version?: string
  id?: string
  slug?: string
  title?: string
  category?: string
  description?: string
  language?: string
  base_url?: string
  home_page_url?: string
  feed_url?: string
  current_feed_url?: string
  favicon?: string
  updated_at?: number
  created_at?: number
  generator?: string
  license?: string
  archive_prefix?: string
  feed_format?: string
  items?: PostType[]
  status?: string
  backlog?: number
  prefix?: string
  user_id?: string
  authors?: AuthorType[]
  funding?: FundingType
  plan?: string
  use_mastodon?: boolean
  use_api?: boolean
  relative_url?: string
  filter?: string
  issn?: string
}

export interface BlogParentType {
  id: string
  title: string
  category?: string
  language?: string
}
