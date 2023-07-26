import { FeedData } from "@extractus/feed-extractor"

export interface AuthorType {
  name: string
  url?: string
  avatar?: string
}
export interface ReferenceType {
  key?: string
  doi?: string
  url?: string
}

export interface PaginationType {
  base_url?: string
  query?: string
  page: number
  pages: number
  total: number
  prev?: number
  next?: number
}

export interface PostType {
  id: string
  doi?: string
  url?: string
  title?: string
  summary?: string
  published_at?: number
  updated_at?: number
  indexed_at?: number
  not_indexed?: boolean
  authors?: AuthorType[]
  image?: string
  content_html?: string
  reference?: ReferenceType[]
  tags?: string[]
  language?: string
  blog_id?: string
  blog_name?: string
  blog?: BlogParentType
}

export interface BlogType extends FeedData {
  version?: string
  id?: string
  title?: string
  category?: string
  description?: string
  language?: string
  base_url?: string
  home_page_url?: string
  feed_url?: string
  current_feed_url?: string
  favicon?: string
  modified_at?: string
  created_at?: string
  generator?: string
  license?: string
  feed_format?: string
  items?: PostType[]
  status?: string
  backlog?: number
  prefix?: string
  user_id?: string
}

export interface BlogParentType {
  id: string
  title: string
  category?: string
  language?: string
}
