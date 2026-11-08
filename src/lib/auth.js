
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { findUserByEmail, getUsersCollection } from "@/lib/users";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: "Email and Password",

            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                const email =
                    typeof credentials?.email === "string"
                        ? credentials.email.trim().toLowerCase()
                        : "";

                const password =
                    typeof credentials?.password === "string"
                        ? credentials.password
                        : "";

                if (!email || !password) return null;

                const user = await findUserByEmail(email);

                if (!user || !user.password) return null;

                // Require email verification before password login.
                if (user.emailVerified !== true) {
                    throw new Error("Please verify your email address before signing in.");
                }

                const passwordMatches = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!passwordMatches) return null;

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                };
            },
        }),

        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider !== "google") {
                return true;
            }

            const email = user.email?.trim().toLowerCase();

            // Accept only verified Google email addresses.
            if (!email || profile?.email_verified !== true) {
                return false;
            }

            const users = await getUsersCollection();

            await users.updateOne(
                { email },
                {
                    $setOnInsert: {
                        name: user.name || "Formiqo User",
                        email,
                        password: null,
                        provider: "google",
                        emailVerified: true,
                        createdAt: new Date(),
                    },
                    $set: {
                        updatedAt: new Date(),
                    },
                },
                { upsert: true }
            );

            const savedUser = await users.findOne({ email });

            if (!savedUser) return false;

            // Map Google login to the existing account when the
            // verified email address matches.
            user.id = savedUser._id.toString();

            return true;
        },

        async jwt({ token, user }) {
            if (user?.id) {
                token.id = user.id;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
            }

            return session;
        },
    },

    pages: {
        signIn: "/login",
    },

    secret: process.env.NEXTAUTH_SECRET,
});
