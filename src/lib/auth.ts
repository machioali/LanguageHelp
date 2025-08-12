import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { UserRole, type UserRoleType } from '@/lib/constants';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              interpreterProfile: {
                include: {
                  credentials: true,
                },
              },
            },
          });

          if (!user) {
            throw new Error('Invalid credentials');
          }

          // For interpreters, check temp password or regular password
          if (user.role === UserRole.INTERPRETER && user.interpreterProfile?.credentials) {
            const interpreterCreds = user.interpreterProfile.credentials;
            let isValidPassword = false;

            // Check temp password first if it exists
            if (interpreterCreds.tempPassword) {
              isValidPassword = await bcrypt.compare(credentials.password, interpreterCreds.tempPassword);
            }
            // Otherwise check regular password
            else if (user.password) {
              isValidPassword = await bcrypt.compare(credentials.password, user.password);
            }

            if (!isValidPassword) {
              throw new Error('Invalid credentials');
            }
          } else {
            // For non-interpreters, use regular password authentication
            if (!user.password) {
              throw new Error('Invalid credentials');
            }

            const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

            if (!isPasswordValid) {
              throw new Error('Invalid credentials');
            }
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as UserRoleType,
            image: user.image,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw new Error('Authentication failed');
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRoleType;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  events: {
    async signOut() {
      // This will be handled by the redirect callback
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
