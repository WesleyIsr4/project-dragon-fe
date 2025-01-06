import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    RELEASE_DATE: new Date().toISOString(),
    SUPABASE_KEY: process.env.SUPABASE_KEY,
    SUPABASE_BASE_URL: process.env.SUPABASE_BASE_URL,
    API_DRAGON_URL: process.env.API_DRAGON_URL,
  },
};

export default nextConfig;
