import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { sendResetPasswordEmail } from "./email";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.COOKIE_SECRET,
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  basePath: "/api/auth",
  user: {
    modelName: "User",
    fields: {
      name: "name",
      email: "email",
      emailVerified: "emailVerified",
      image: "image",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    additionalFields: {
      name: {
        type: "string",
        input: true,
      },
    },
  },
  account: {
    modelName: "Account",
    fields: {
      providerId: "provider",
      accountId: "providerAccountId",
      userId: "userId",
      password: "password",
      accessToken: "accessToken",
      refreshToken: "refreshToken",
      idToken: "idToken",
      expiresAt: "expiresAt",
      accessTokenExpiresAt: "accessTokenExpiresAt",
      refreshTokenExpiresAt: "refreshTokenExpiresAt",
      scope: "scope",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
  session: {
    modelName: "Session",
    fields: {
      token: "token",
      userId: "userId",
      expiresAt: "expiresAt",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
    sendResetPassword: sendResetPasswordEmail,
  },
});

export async function getSession(req: Request) {
  return await auth.api.getSession({ headers: req.headers });
}
