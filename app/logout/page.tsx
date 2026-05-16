"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      try {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login")
                }
            }
        })
      } catch (error) {
        console.error("Logout failed:", error)
        router.push("/login")
      }
    }

    performLogout()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Logging out...</h1>
        <p className="text-muted-foreground">Please wait while we sign you out.</p>
      </div>
    </div>
  )
}
