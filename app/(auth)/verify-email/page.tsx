"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error")
        setErrorMessage("Invalid verification token.")
        return
      }

      try {
        const { error } = await authClient.verifyEmail({
          query: { token },
        })

        if (error) {
          setStatus("error")
          setErrorMessage(error.message || "Email verification failed.")
        } else {
          setStatus("success")
        }
      } catch (err) {
        setStatus("error")
        setErrorMessage("An unexpected error occurred.")
      }
    }

    verify()
  }, [token])

  return (
    <div className="flex flex-col items-center space-y-6 text-center">
      <div className="w-16 h-16 rounded-3xl flex items-center justify-center bg-zinc-50 border border-zinc-100">
        {status === "loading" && (
          <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
        )}
        {status === "success" && (
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {status === "error" && (
          <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          {status === "loading" && "Verifying"}
          {status === "success" && "Success"}
          {status === "error" && "Failed"}
        </h1>
        
        <p className="text-zinc-500 font-medium max-w-[260px] mx-auto">
          {status === "loading" && "Please wait while we confirm your email address."}
          {status === "success" && "Your email has been verified. You can now access your dashboard."}
          {status === "error" && (errorMessage || "The link might be expired or invalid.")}
        </p>
      </div>

      {status !== "loading" && (
        <Button asChild className="w-full h-11 bg-black hover:bg-zinc-800 text-white font-bold rounded-lg transition-all">
          <Link href="/login">Continue to Sign In</Link>
        </Button>
      )}
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center space-y-6 text-center">
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center bg-zinc-50 border border-zinc-100">
          <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Loading</h1>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
