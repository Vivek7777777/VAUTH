"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { signUp, signIn } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid Email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
})

export default function SignupPage() {
  const router = useRouter()
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setIsEmailLoading(true)
    setServerError(null)
    try {
      const { error: signUpError } = await signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
        callbackURL: "/",
      })

      if (signUpError) {
        setServerError(signUpError.message || "Registration failed. Please try again.")
      } else {
        router.push("/")
      }
    } catch (err) {
      setServerError("A server error occurred. Please try again later.")
    } finally {
      setIsEmailLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setServerError(null)
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      })
    } catch (error) {
      setServerError("Google registration failed.")
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const isLoading = isEmailLoading || isGoogleLoading

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Create Account</h1>
        <p className="text-zinc-400 font-medium">Join VAuth and secure your digital assets today.</p>
      </div>

      <div className="space-y-3">
        <Button 
          type="button"
          variant="outline" 
          className="w-full h-10 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 hover:text-zinc-900 transition-all font-semibold flex items-center justify-center gap-3 rounded-lg" 
          onClick={handleGoogleLogin} 
          disabled={isLoading}
        >
          {isGoogleLoading ? (
             <div className="h-4 w-4 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
            </svg>
          )}
          {isGoogleLoading ? "Connecting..." : "Continue with Google"}
        </Button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-100" />
          </div>
          <div className="relative flex justify-center text-xs uppercase text-zinc-400">
            <span className="bg-white px-2">or continue with email</span>
          </div>
        </div>

        {serverError && (
          <div className="rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-600 font-medium text-center">
            {serverError}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 font-semibold">Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="John Doe" 
                      className="h-10 border-zinc-200 focus:ring-zinc-500" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 font-semibold">Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="name@example.com" 
                      className="h-10 border-zinc-200 focus:ring-zinc-500" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 font-semibold">Password</FormLabel>
                  <FormControl>
                    <PasswordInput 
                      className="h-10 border-zinc-200 focus:ring-zinc-500" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 font-semibold">Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput 
                      className="h-10 border-zinc-200 focus:ring-zinc-500" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-red-600" />
                </FormItem>
              )}
            />
            <Button className="w-full h-10 bg-black hover:bg-zinc-800 text-white font-bold text-base transition-all rounded-lg" type="submit" disabled={isLoading}>
              {isEmailLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </Form>
      </div>

      <p className="text-center text-sm text-zinc-500 font-medium">
        Already have an account?{" "}
        <Link href="/login" className="text-black hover:underline underline-offset-4 decoration-2">
          Sign In
        </Link>
      </p>
    </div>
  )
}
