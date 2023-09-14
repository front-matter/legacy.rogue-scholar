import {
  DocumentSchema,
  SearchParams,
  SearchResponse,
  SearchResponseHit,
} from "typesense/src/Typesense/Documents"

import { AuthorType, ReferenceType } from "@/types/blog"

export interface DocumentType extends DocumentSchema {
  id?: string
  doi?: string
  url?: string
  title?: string
  summary?: string
  published_at?: number
  updated_at?: number
  authors?: AuthorType[]
  image?: string
  content_html?: string
  reference?: ReferenceType[]
  tags?: string[]
  language?: string
  blog_id?: string
  blog_slug?: string
}

export type PostSearchResponse = SearchResponse<DocumentType>
export type PostSearchResponseHit = SearchResponseHit<DocumentType>
export type PostSearchParams = SearchParams
