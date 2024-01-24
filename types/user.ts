import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  admin: boolean;
  nickname?: string;
  name?: string;
  picture?: string;
  updated_at?: string;
  sub?: string;
  email?: string;
}

export interface UserProfile {
  id: string;
  display_name?: string;
  avatar_url?: string;
  updated_at?: string;
  website?: string;
}

export type UserContextType = {
  user: SupabaseUser;
  userLoaded: boolean;
};
