import { FeedData } from "@extractus/feed-extractor"
import { Title } from "vega"

export interface AuthorType {
  name: string
  url?: string
  email?: string
  avatar?: string
}

export interface ReferenceType {
  key?: string
  id?: string
  type?: string
  titles?: TitleType[]
  container?: ContainerType
  contributors?: ContributorType[]
  date?: DateType
  subjects?: SubjectType[]
}

export interface ContainerType {
  identifier?: string
  identifierType?: string
  title?: string
  type?: string
}

export interface ContributorType {
  id?: string
  name?: string
  givenName?: string
  familyName?: string
}

export interface DateType {
  published?: string
  updated?: string
  accessed?: string
  indexed?: string
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
  page: number
  pages: number
  total: number
  prev?: number
  next?: number
}

export interface SubjectType {
  subject: string
}

export interface TitleType {
  title: string
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

export interface FormType {
  slug: string
  title?: string
  home_page_url: string
  category: string
  mastodon?: string
  status: string
  user_id: string
  created_at: number
}

export interface PostType {
  id: string
  guid?: string
  doi?: string
  url?: string
  archive_url?: string
  title?: string
  summary?: string
  abstract?: string
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
  blog_name?: string
  blog_slug?: string
  blog?: BlogParentType
  status?: string
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
  prefix?: string
  user_id?: string
  authors?: AuthorType[]
  funding?: FundingType
  plan?: string
  mastodon?: string
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
