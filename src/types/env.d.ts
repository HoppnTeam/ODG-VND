declare namespace NodeJS {
  interface ProcessEnv {
    // Supabase Configuration
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;

    // Stripe Configuration
    STRIPE_SECRET_KEY: string;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;

    // Application Configuration
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';

    // Database URLs (if any direct connections)
    DATABASE_URL?: string;

    // Optional: Analytics or other services
    NEXT_PUBLIC_GA_ID?: string;
    VERCEL_URL?: string;
    VERCEL_ENV?: 'production' | 'preview' | 'development';
  }
}

// Additional type definitions for environment variables
export interface EnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey: string;
  };
  stripe: {
    secretKey: string;
    publishableKey: string;
    webhookSecret: string;
  };
  app: {
    url: string;
    secret: string;
    environment: 'development' | 'production' | 'test';
  };
}

// Helper function to validate required environment variables
export function validateEnvironmentVariables(): EnvironmentConfig {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  return {
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY!,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    },
    app: {
      url: process.env.NEXTAUTH_URL!,
      secret: process.env.NEXTAUTH_SECRET!,
      environment: process.env.NODE_ENV as 'development' | 'production' | 'test',
    },
  };
}