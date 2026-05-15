import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: {
    provider: "sqlite",
    url: "file:./auth.db",
  },
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [nextCookies()],
});
