import {
  DocumentSchema,
  SearchParams,
  SearchResponse,
  SearchResponseHit,
} from "typesense/src/Typesense/Documents"

import { AuthorType, ReferenceType, FundingType } from "@/types/blog"

export interface DocumentType extends DocumentSchema {
  id?: string
  doi?: string
  url?: string
  guid?: string
  title?: string
  summary?: string
  abstract?: string
  published_at?: number
  updated_at?: number
  authors?: AuthorType[]
  image?: string
  content_text?: string
  reference?: ReferenceType[]
  tags?: string[]
  language?: string
  blog_slug?: string
  status?: string
}

export interface BlogType extends DocumentSchema {
  id?: string
  slug?: string
  title?: string
  description?: string
  language?: string
  favicon?: string
  feed_url?: string
  current_feed_url?: string
  archive_prefix?: string
  feed_format?: string
  home_page_url?: string
  mastodon?: string
  created_at?: number
  updated_at?: number
  license?: string
  generator?: string
  category?: string
  backlog?: number
  prefix?: string
  status?: string
  plan?: string
  funding?: FundingType
}

export type PostSearchResponse = SearchResponse<DocumentType>
export type PostSearchResponseHit = SearchResponseHit<DocumentType>
export type PostSearchParams = SearchParams

export type BlogSearchResponse = SearchResponse<BlogType>
export type BlogSearchParams = SearchParams
