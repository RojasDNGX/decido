import NextAuth from 'next-auth';
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
        };
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
    async jwt({ token, user }: { token: Record<string, unknown>; user: Record<string, unknown> | null }) {
      if (user) {
        token.id = user.id;
        token.plan = (user.plan as string) || 'free';
        token.role = user.role;
      }
      
      const email = token.email as string | undefined;
      if (email && !token.plan) {
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
    async session({ session, token }: { session: Record<string, unknown>; token: Record<string, unknown> }) {
      const user = session.user as Record<string, unknown> | undefined;
      if (user) {
        user.id = token.id;
        user.plan = token.plan;
        user.role = token.role;
      }
      return session;
    },
  },
});
