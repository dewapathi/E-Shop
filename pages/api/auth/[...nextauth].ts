import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/libs/prismadb";
import bcrypt from 'bcrypt';

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: '315341188219-f7aeuopkfct5tfg5mtoinn19ti34kc9j.apps.googleusercontent.com',
            clientSecret: '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',
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: {
                    label: 'email',
                    type: 'email',
                },
                password: {
                    label: "password",
                    type: "password"
                }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid email or password');
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if (!user || !user?.hashedPassword) {
                    throw new Error('Invalid email or password');
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                )

                if (!isCorrectPassword) {
                    throw new Error('Invalid email or password');
                }

                return user;
            },
        })
    ],
    pages: {
        signIn: '/login',
        signOut: '/login', 
        error: '/auth/error',
    },
    debug: process.env.NODE_ENV === "development",
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions);