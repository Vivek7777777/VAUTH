import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    plugins: [
        jwtClient()
    ]
})

export const forgetPassword = async (options: { email: string; redirectTo: string }) => {
    return await (authClient as any).requestPasswordReset(options);
};

export const { signIn, signUp, useSession } = authClient
