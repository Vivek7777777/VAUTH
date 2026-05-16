import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { jwt } from 'better-auth/plugins';
import Mailjet from 'node-mailjet';
import { db } from './db';
import * as schema from './schema';

const mailjet = Mailjet.apiConnect(
  process.env.MJ_API_KEY_PUBLIC || '',
  process.env.MJ_API_KEY_PRIVATE || ''
);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [
    nextCookies(),
    jwt({
      jwt: {
        expirationTime: 60 * 60,
      },
      getClaims: async (user: { id: string; email: string; name: string; emailVerified: boolean }) => {
        const appUser = await db.query.applicationUser.findFirst({
          where: (fields, { eq }) => eq(fields.userId, user.id),
        });
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: appUser?.role || 'user',
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      try {
        await mailjet.post('send', { version: 'v3.1' }).request({
          Messages: [
            {
              From: {
                Email: process.env.MJ_SENDER_EMAIL,
                Name: 'VAuth Support',
              },
              To: [
                {
                  Email: user.email,
                },
              ],
              Subject: 'Reset your password',
              HTMLPart: `
                <h2>Reset your password</h2>
                <p>Click the link below to reset your password:</p>
                <a href="${url}">${url}</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, you can safely ignore this email.</p>
              `,
            },
          ],
        });
        console.log(`Reset password email sent to ${user.email}`);
      } catch (error) {
        console.error('Mailjet Error:', error);
        throw error;
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    async sendVerificationEmail({ user, url }) {
      try {
        await mailjet.post('send', { version: 'v3.1' }).request({
          Messages: [
            {
              From: {
                Email: process.env.MJ_SENDER_EMAIL,
                Name: 'VAuth Support',
              },
              To: [
                {
                  Email: user.email,
                },
              ],
              Subject: 'Verify your email address',
              HTMLPart: `
                <h2>Verify your email address</h2>
                <p>Click the link below to verify your email address:</p>
                <a href="${url}">${url}</a>
                <p>This link will expire in 24 hours.</p>
                <p>If you didn't create an account, you can safely ignore this email.</p>
              `,
            },
          ],
        });
        console.log(`Verification email sent to ${user.email}`);
      } catch (error) {
        console.error('Mailjet Error:', error);
        throw error;
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
