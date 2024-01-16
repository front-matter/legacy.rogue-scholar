import { AuthorType, ReferenceType, RelationshipType } from "./blog"

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      blogs: {
        Row: {
          category?: string
          description?: string
          id?: string
          slug?: string
          title?: string
          feed_url?: string
          home_page_url?: string
          feed_format?: string
          user_id?: string
          created_at?: number
          updated_at?: number
          language?: string
          favicon?: string
          license?: string
          generator?: string
          prefix?: string
          use_mastodon?: boolean
          status?: string
          authors?: AuthorType[]
        }
        Insert: {
          category?: string
          description?: string
          id?: string
          slug?: string
          title?: string
          feed_url?: string
          home_page_url?: string
          feed_format?: string
          user_id?: string
          created_at?: number
          updated_at?: number
          language?: string
          favicon?: string
          license?: string
          generator?: string
          prefix?: string
          use_mastodon?: boolean
          status?: string
          authors?: AuthorType[]
        }
        Update: {
          category?: string
          description?: string
          id?: string
          title?: string
          feed_url?: string
          home_page_url?: string
          feed_format?: string
          user_id?: string
          created_at?: number
          updated_at?: number
          language?: string
          favicon?: string
          license?: string
          generator?: string
          prefix?: string
          use_mastodon?: boolean
          status?: string
          authors?: AuthorType[]
        }
      }
      posts: {
        Row: {
          authors?: AuthorType[]
          blog_slug?: string
          blog_name?: string
          content_text?: string
          updated_at?: number
          published_at?: number
          indexed_at?: number
          indexed?: boolean
          doi?: string
          image?: string
          language?: string
          reference?: ReferenceType[]
          relationships?: RelationshipType[]
          summary?: string
          tags?: string[]
          title?: string
          url?: string
          id?: string
          guid?: string
        }
        Insert: {
          authors?: AuthorType[]
          blog_slug?: string
          blog_name?: string
          content_text?: string
          updated_at?: number
          published_at?: number
          indexed_at?: number
          indexed?: boolean
          doi?: string
          image?: string
          language?: string
          reference?: ReferenceType[]
          relationships?: RelationshipType[]
          summary?: string
          tags?: string[]
          title?: string
          url?: string
          id?: string
          guid?: string
        }
        Update: {
          authors?: AuthorType[]
          blog_slug?: string
          blog_name?: string
          content_text?: string
          updated_at?: number
          published_at?: number
          indexed_at?: number
          indexed?: boolean
          doi?: string
          image?: string
          language?: string
          reference?: ReferenceType[]
          relationships?: RelationshipType[]
          summary?: string
          tags?: string[]
          title?: string
          url?: string
          id?: string
          guid?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {}
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
