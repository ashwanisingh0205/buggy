// src/lib/config.ts
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  appUrl: 'http://localhost:3000',
  twitter: {
    callbackUrl: 'http://localhost:3000/auth/twitter/callback'
  },
  youtube: {
    callbackUrl: 'http://localhost:3000/auth/youtube/callback'
  },
};
