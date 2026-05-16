"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { authClient, forgetPassword } from "@/lib/auth-client"
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

const forgotSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
})

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof forgotSchema>) {
    setIsLoading(true)
    setServerError(null)
    try {
      const { error: forgotError } = await forgetPassword({
        email: values.email,
        redirectTo: "/reset-password",
      })

      if (forgotError) {
        console.error("Forgot password error:", forgotError)
        setServerError(forgotError.message || "Failed to send reset email.")
      } else {
        setIsSent(true)
      }
    } catch (err) {
      setServerError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSent) {
    return (
      <div className="flex flex-col items-center space-y-6 text-center">
        <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-center">
          <svg className="h-8 w-8 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Check Email</h1>
          <p className="text-zinc-500 font-medium max-w-[260px] mx-auto">
            Password reset instructions have been sent to your email address.
          </p>
        </div>
        <Button variant="outline" asChild className="w-full h-10 border-zinc-200 hover:bg-zinc-50 text-zinc-900 font-bold rounded-lg">
          <Link href="/login">Back to Sign In</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Forgot Password</h1>
        <p className="text-zinc-500 font-medium">Enter your email to reset your account password</p>
      </div>

      <div className="space-y-3">
        {serverError && (
          <div className="rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-600 font-medium">
            {serverError}
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 font-semibold">Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="name@company.com" 
                      className="h-10 border-zinc-200 focus:ring-zinc-500" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-red-600" />
                </FormItem>
              )}
            />
            <Button className="w-full h-10 bg-black hover:bg-zinc-800 text-white font-bold text-base transition-all rounded-lg" type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </div>

      <p className="text-center text-sm text-zinc-500 font-medium">
        Suddenly remembered?{" "}
        <Link href="/login" className="text-black hover:underline underline-offset-4 decoration-2">
          Back to Login
        </Link>
      </p>
    </div>
  )
}
