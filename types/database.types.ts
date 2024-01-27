export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      blogs: {
        Row: {
          api: boolean | null
          archive_prefix: string | null
          authors: Json | null
          backlog: number
          canonical_url: boolean | null
          category: string
          created_at: number
          current_feed_url: string | null
          description: string | null
          favicon: string | null
          feed_format: Database["public"]["Enums"]["feed_format"] | null
          feed_url: string | null
          filter: string | null
          funding: Json | null
          generator: string | null
          generator_raw: string | null
          home_page_url: string | null
          id: string
          indexed: boolean | null
          issn: string | null
          language: Database["public"]["Enums"]["language_enum"] | null
          license: Database["public"]["Enums"]["license"] | null
          plan: Database["public"]["Enums"]["plan_enum"] | null
          prefix: Database["public"]["Enums"]["prefix_enum"] | null
          relative_url: string | null
          secure: boolean | null
          slug: string
          status: Database["public"]["Enums"]["status_enum"]
          title: string | null
          updated_at: number
          use_api: boolean | null
          mastodon: string | null
          user_id: string | null
          version: Database["public"]["Enums"]["version_enum"]
        }
        Insert: {
          api?: boolean | null
          archive_prefix?: string | null
          authors?: Json | null
          backlog?: number
          canonical_url?: boolean | null
          category?: string
          created_at?: number
          current_feed_url?: string | null
          description?: string | null
          favicon?: string | null
          feed_format?: Database["public"]["Enums"]["feed_format"] | null
          feed_url?: string | null
          filter?: string | null
          funding?: Json | null
          generator?: string | null
          generator_raw?: string | null
          home_page_url?: string | null
          id?: string
          indexed?: boolean | null
          issn?: string | null
          language?: Database["public"]["Enums"]["language_enum"] | null
          license?: Database["public"]["Enums"]["license"] | null
          plan?: Database["public"]["Enums"]["plan_enum"] | null
          prefix?: Database["public"]["Enums"]["prefix_enum"] | null
          relative_url?: string | null
          secure?: boolean | null
          slug?: string
          status?: Database["public"]["Enums"]["status_enum"]
          title?: string | null
          updated_at?: number
          use_api?: boolean | null
          mastodon?: string | null
          user_id?: string | null
          version?: Database["public"]["Enums"]["version_enum"]
        }
        Update: {
          api?: boolean | null
          archive_prefix?: string | null
          authors?: Json | null
          backlog?: number
          canonical_url?: boolean | null
          category?: string
          created_at?: number
          current_feed_url?: string | null
          description?: string | null
          favicon?: string | null
          feed_format?: Database["public"]["Enums"]["feed_format"] | null
          feed_url?: string | null
          filter?: string | null
          funding?: Json | null
          generator?: string | null
          generator_raw?: string | null
          home_page_url?: string | null
          id?: string
          indexed?: boolean | null
          issn?: string | null
          language?: Database["public"]["Enums"]["language_enum"] | null
          license?: Database["public"]["Enums"]["license"] | null
          plan?: Database["public"]["Enums"]["plan_enum"] | null
          prefix?: Database["public"]["Enums"]["prefix_enum"] | null
          relative_url?: string | null
          secure?: boolean | null
          slug?: string
          status?: Database["public"]["Enums"]["status_enum"]
          title?: string | null
          updated_at?: number
          use_api?: boolean | null
          mastodon?: string | null
          user_id?: string | null
          version?: Database["public"]["Enums"]["version_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "blogs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      blogs_sync_tracker: {
        Row: {
          blog_id: string
          is_synced: boolean | null
        }
        Insert: {
          blog_id: string
          is_synced?: boolean | null
        }
        Update: {
          blog_id?: string
          is_synced?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "blogs_sync_tracker_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: true
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          }
        ]
      }
      posts: {
        Row: {
          archive_url: string | null
          authors: Json | null
          blog_name: string | null
          blog_slug: string
          category: string | null
          content_text: string | null
          doi: string | null
          guid: string
          id: string
          image: string | null
          images: Json
          indexed: boolean | null
          indexed_at: number
          language: string | null
          published_at: number | null
          reference: Json | null
          relationships: Json
          summary: string
          tags: string[]
          title: string
          updated: boolean | null
          updated_at: number | null
          url: string
        }
        Insert: {
          archive_url?: string | null
          authors?: Json | null
          blog_name?: string | null
          blog_slug: string
          category?: string | null
          content_text?: string | null
          doi?: string | null
          guid: string
          id?: string
          image?: string | null
          images?: Json
          indexed?: boolean | null
          indexed_at?: number
          language?: string | null
          published_at?: number | null
          reference?: Json | null
          relationships?: Json
          summary: string
          tags: string[]
          title: string
          updated?: boolean | null
          updated_at?: number | null
          url: string
        }
        Update: {
          archive_url?: string | null
          authors?: Json | null
          blog_name?: string | null
          blog_slug?: string
          category?: string | null
          content_text?: string | null
          doi?: string | null
          guid?: string
          id?: string
          image?: string | null
          images?: Json
          indexed?: boolean | null
          indexed_at?: number
          language?: string | null
          published_at?: number | null
          reference?: Json | null
          relationships?: Json
          summary?: string
          tags?: string[]
          title?: string
          updated?: boolean | null
          updated_at?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_blog_slug_fkey"
            columns: ["blog_slug"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["slug"]
          }
        ]
      }
      posts_sync_tracker: {
        Row: {
          is_synced: boolean | null
          post_id: string
        }
        Insert: {
          is_synced?: boolean | null
          post_id: string
        }
        Update: {
          is_synced?: boolean | null
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_sync_tracker_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: true
            referencedRelation: "posts"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      sync_blogs_updates: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      sync_posts_updates: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      updated: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      category:
        | "Engineering and Technology"
        | "Medical and Health Sciences"
        | "Natural Sciences"
        | "Social Sciences"
        | "Humanities"
      category_enum:
        | "Natural Sciences"
        | "Engineering and Technology"
        | "Medical and Health Sciences"
        | "Agricultural Sciences"
        | "Social Sciences"
        | "Humanities"
      feed_format:
        | "application/rss+xml"
        | "application/atom+xml"
        | "application/feed+json"
        | "application/json"
      generator:
        | "WordPress"
        | "Ghost"
        | "Blogger"
        | "Medium"
        | "Substack"
        | "Hugo"
        | "Jekyll"
        | "Quarto"
        | "PubPub"
        | "Drupal"
      language_enum: "en" | "de" | "es" | "it" | "pt" | "fr" | "tr"
      license: "https://creativecommons.org/licenses/by/4.0/legalcode"
      newsletter_enum: "digest"
      plan_enum: "Starter" | "Team" | "Enterprise"
      prefix_enum:
        | "10.53731"
        | "10.54900"
        | "10.59350"
        | "10.59351"
        | "10.59348"
        | "10.59349"
      status: "submitted" | "approved" | "active" | "expired"
      status_enum: "submitted" | "approved" | "active" | "expired" | "archived"
      version_enum: "https://jsonfeed.org/version/1.1"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
