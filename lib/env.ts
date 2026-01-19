// Runtime environment configuration
// Access runtime config values set by Docker container

type RuntimeConfig = {
  NEXT_PUBLIC_SITE_URL: string
  NEXT_PUBLIC_API_URL: string
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
}

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: RuntimeConfig
  }
}

// Get runtime config from window or fallback to process.env
export function getRuntimeConfig(): RuntimeConfig {
  if (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__) {
    return window.__RUNTIME_CONFIG__
  }
  
  // Fallback to process.env for server-side or local development
  return {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || '',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  }
}

// Export individual config values for convenience
export const NEXT_PUBLIC_SITE_URL = () => getRuntimeConfig().NEXT_PUBLIC_SITE_URL
export const NEXT_PUBLIC_API_URL = () => getRuntimeConfig().NEXT_PUBLIC_API_URL
export const NEXT_PUBLIC_SUPABASE_URL = () => getRuntimeConfig().NEXT_PUBLIC_SUPABASE_URL
export const NEXT_PUBLIC_SUPABASE_ANON_KEY = () => getRuntimeConfig().NEXT_PUBLIC_SUPABASE_ANON_KEY
