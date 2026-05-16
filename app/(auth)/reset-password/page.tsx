"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { PasswordInput } from "@/components/ui/password-input"

const resetSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
})

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof resetSchema>) {
    if (!token) {
      setServerError("Invalid or missing reset token.")
      return
    }

    setIsLoading(true)
    setServerError(null)
    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword: values.password,
        token: token,
      })

      if (resetError) {
        setServerError(resetError.message || "Failed to reset password.")
      } else {
        router.push("/login")
      }
    } catch (err) {
      setServerError("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">New Password</h1>
        <p className="text-zinc-500 font-medium">Create a secure password for your account</p>
      </div>

      <div className="space-y-3">
        {serverError && (
          <div className="rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-600 font-medium text-center">
            {serverError}
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 font-semibold">New Password</FormLabel>
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
              {isLoading ? "Resetting..." : "Save Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
        <p className="text-zinc-500 font-medium">Loading reset form...</p>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
