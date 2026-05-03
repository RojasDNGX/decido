import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { getOrCreateUser } from '@/lib/users-db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const email = user?.email ?? (token.email as string | undefined);
      if (email) {
        const dbUser = getOrCreateUser(
          email,
          user?.name ?? undefined,
          user?.image ?? undefined
        );
        token.plan = dbUser.plan;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { plan?: string }).plan = token.plan as string;
      }
      return session;
    },
  },
});
