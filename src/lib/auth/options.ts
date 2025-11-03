import { kyselyAdapter } from "@/lib/auth/adapter";
import { db } from "@/db/kysely";
import type { UserRole } from "@/db/types";
import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import nodemailer from "nodemailer";

const requiredEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is required but missing from environment variables.`);
  }
  return value;
};

const emailProvider = EmailProvider({
  from: requiredEnv("EMAIL_FROM"),
  maxAge: 10 * 60,
  server: {
    host: requiredEnv("EMAIL_SERVER_HOST"),
    port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
    auth: {
      user: requiredEnv("EMAIL_SERVER_USER"),
      pass: requiredEnv("EMAIL_SERVER_PASSWORD"),
    },
  },
  async sendVerificationRequest({ identifier, url, provider }) {
    const { host } = new URL(url);
    const transport = nodemailer.createTransport(provider.server);

    await transport.sendMail({
      to: identifier,
      from: provider.from,
      subject: `Log in to ${host}`,
      text: `Sign in by clicking the link: ${url}\n\nThis link will expire in 10 minutes.`,
      html: `
        <p>Hi there,</p>
        <p>Use the link below to access your Roamalto dashboard:</p>
        <p><a href="${url}">Sign in to ${host}</a></p>
        <p>This magic link expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
      `,
    });
  },
});

const googleProvider =
  process.env.OAUTH_GOOGLE_ID && process.env.OAUTH_GOOGLE_SECRET
    ? GoogleProvider({
        clientId: process.env.OAUTH_GOOGLE_ID,
        clientSecret: process.env.OAUTH_GOOGLE_SECRET,
      })
    : null;

const adminEmails = (process.env.ADMIN_SEED_EMAIL ?? "admin@example.com")
  .split(",")
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);

const roleFromEmail = (email: string | null | undefined): UserRole => {
  if (!email) {
    return "viewer";
  }
  const normalized = email.toLowerCase();
  if (adminEmails.includes(normalized)) {
    return "admin";
  }
  return "viewer";
};

export const authOptions: NextAuthOptions = {
  adapter: kyselyAdapter(),
  session: {
    strategy: "jwt",
  },
  secret: requiredEnv("NEXTAUTH_SECRET"),
  providers: [emailProvider, ...(googleProvider ? [googleProvider] : [])],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && !process.env.OAUTH_GOOGLE_ID) {
        return false;
      }

      const desiredRole = roleFromEmail(user.email);
      if (user.role !== desiredRole) {
        await db
          .updateTable("users")
          .set({
            role: desiredRole,
          })
          .where("id", "=", user.id)
          .execute();
        user.role = desiredRole;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as UserRole;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id ?? "";
        session.user.role = (token.role as UserRole) ?? "viewer";
      }
      return session;
    },
  },
  events: {
    createUser: async ({ user }) => {
      const desiredRole = roleFromEmail(user.email);
      await db
        .updateTable("users")
        .set({
          role: desiredRole,
        })
        .where("id", "=", user.id)
        .execute();
    },
  },
  debug: process.env.NODE_ENV === "development",
};
