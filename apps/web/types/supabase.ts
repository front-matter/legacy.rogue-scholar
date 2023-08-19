import { AuthorType, ReferenceType } from "./blog";

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      blogs: {
        Row: {
          category?: string;
          description?: string;
          id?: string;
          title?: string;
          feed_url?: string;
          home_page_url?: string;
          feed_format?: string;
          user_id?: string;
          created_at?: string;
          modified_at?: string;
          language?: string;
          favicon?: string;
          license?: string;
          generator?: string;
          prefix?: string;
          mastodon?: string;
          status?: string;
          authors?: AuthorType[];
        };
        Insert: {
          category?: string;
          description?: string;
          id?: string;
          title?: string;
          feed_url?: string;
          home_page_url?: string;
          feed_format?: string;
          user_id?: string;
          created_at?: string;
          modified_at?: string;
          language?: string;
          favicon?: string;
          license?: string;
          generator?: string;
          prefix?: string;
          mastodon?: string;
          status?: string;
          authors?: AuthorType[];
        };
        Update: {
          category?: string;
          description?: string;
          id?: string;
          title?: string;
          feed_url?: string;
          home_page_url?: string;
          feed_format?: string;
          user_id?: string;
          created_at?: string;
          modified_at?: string;
          language?: string;
          favicon?: string;
          license?: string;
          generator?: string;
          prefix?: string;
          mastodon?: string;
          status?: string;
          authors?: AuthorType[];
        };
      };
      posts: {
        Row: {
          authors?: AuthorType[];
          blog_id?: string;
          blog_name?: string;
          content_html?: string;
          updated_at?: number;
          published_at?: number;
          indexed_at?: number;
          not_indexed?: boolean;
          doi?: string;
          image?: string;
          language?: string;
          reference?: ReferenceType[];
          summary?: string;
          tags?: string[];
          title?: string;
          url?: string;
          id?: string;
        }
        Insert: {
          authors?: AuthorType[];
          blog_id?: string;
          blog_name?: string;
          content_html?: string;
          updated_at?: number;
          published_at?: number;
          indexed_at?: number;
          not_indexed?: boolean;
          doi?: string;
          image?: string;
          language?: string;
          reference?: ReferenceType[];
          summary?: string;
          tags?: string[];
          title?: string;
          url?: string;
          id?: string;
        };
        Update: {
          authors?: AuthorType[];
          blog_id?: string;
          blog_name?: string;
          updated_at?: number;
          published_at?: number;
          indexed_at?: number;
          not_indexed?: boolean;
          doi?: string;
          image?: string;
          language?: string;
          reference?: ReferenceType[];
          summary?: string;
          tags?: string[];
          title?: string;
          url?: string;
          id?: string;
        };
      };
      customers: {
        Row: {
          stripe_customer_id: string;
          user_id: string;
        };
        Insert: {
          stripe_customer_id: string;
          user_id: string;
        };
        Update: {
          stripe_customer_id?: string;
          user_id?: string;
        };
      };
      prices: {
        Row: {
          active: boolean | null;
          currency: string | null;
          description: string | null;
          id: string;
          interval: Database['public']['Enums']['pricing_plan_interval'] | null;
          interval_count: number | null;
          metadata: Json | null;
          product_id: string | null;
          trial_period_days: number | null;
          type: Database['public']['Enums']['pricing_type'] | null;
          unit_amount: number | null;
        };
        Insert: {
          active?: boolean | null;
          currency?: string | null;
          description?: string | null;
          id: string;
          interval?: Database['public']['Enums']['pricing_plan_interval'] | null;
          interval_count?: number | null;
          metadata?: Json | null;
          product_id?: string | null;
          trial_period_days?: number | null;
          type?: Database['public']['Enums']['pricing_type'] | null;
          unit_amount?: number | null;
        };
        Update: {
          active?: boolean | null;
          currency?: string | null;
          description?: string | null;
          id?: string;
          interval?: Database['public']['Enums']['pricing_plan_interval'] | null;
          interval_count?: number | null;
          metadata?: Json | null;
          product_id?: string | null;
          trial_period_days?: number | null;
          type?: Database['public']['Enums']['pricing_type'] | null;
          unit_amount?: number | null;
        };
      };
      products: {
        Row: {
          active: boolean | null;
          description: string | null;
          id: string;
          image: string | null;
          metadata: Json | null;
          name: string | null;
        };
        Insert: {
          active?: boolean | null;
          description?: string | null;
          id: string;
          image?: string | null;
          metadata?: Json | null;
          name?: string | null;
        };
        Update: {
          active?: boolean | null;
          description?: string | null;
          id?: string;
          image?: string | null;
          metadata?: Json | null;
          name?: string | null;
        };
      };
      subscriptions: {
        Row: {
          cancel_at: string | null;
          cancel_at_period_end: boolean | null;
          canceled_at: string | null;
          created_at: string;
          current_period_end: string;
          current_period_start: string;
          ended_at: string | null;
          id: string;
          metadata: Json | null;
          price_id: string | null;
          product_id: string;
          quantity: number | null;
          status: Database['public']['Enums']['subscription_status'] | null;
          trial_end: string | null;
          trial_start: string | null;
          user_id: string;
        };
        Insert: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created_at?: string;
          current_period_end?: string;
          current_period_start?: string;
          ended_at?: string | null;
          id: string;
          metadata?: Json | null;
          price_id?: string | null;
          product_id: string;
          quantity?: number | null;
          status?: Database['public']['Enums']['subscription_status'] | null;
          trial_end?: string | null;
          trial_start?: string | null;
          user_id: string;
        };
        Update: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created_at?: string;
          current_period_end?: string;
          current_period_start?: string;
          ended_at?: string | null;
          id?: string;
          metadata?: Json | null;
          price_id?: string | null;
          product_id?: string;
          quantity?: number | null;
          status?: Database['public']['Enums']['subscription_status'] | null;
          trial_end?: string | null;
          trial_start?: string | null;
          user_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      pricing_plan_interval: 'day' | 'week' | 'month' | 'year';
      pricing_type: 'one_time' | 'recurring';
      subscription_status:
        | 'trialing'
        | 'active'
        | 'canceled'
        | 'incomplete'
        | 'incomplete_expired'
        | 'past_due'
        | 'unpaid'
        | 'paused';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
