import NextAuth, { type Session, type User } from 'next-auth';
import { type JWT } from 'next-auth/jwt';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { getOrCreateUser, getUserByEmail } from '@/lib/users-db';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = getUserByEmail(credentials.email as string);
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password as string, user.password);
        if (!isValid) return null;

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          plan: user.plan,
          role: user.role
        } as any;
      }
    })
  ],
  trustHost: true,
  debug: true,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | any }) {
      if (user) {
        token.id = user.id;
        token.plan = (user.plan as string) || 'free';
        token.role = user.role;
      }
      
      // HOTFIX B: ALWAYS refresh plan from DB on every JWT callback.
      // This ensures Stripe webhook changes (free→pro) are immediately reflected
      // without requiring a re-login or waiting for the 30-day token expiry.
      const email = token.email as string | undefined;
      if (email) {
        const userRow = getOrCreateUser(
          email, 
          token.name as string || undefined, 
          token.picture as string || undefined
        );
        token.plan = userRow.plan;
        token.role = userRow.role;
        token.id = String(userRow.id);
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).plan = token.plan;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});
