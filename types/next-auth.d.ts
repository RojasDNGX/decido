import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      plan?: 'free' | 'pro';
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    plan?: 'free' | 'pro';
  }
}
