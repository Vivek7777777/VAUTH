import { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand Side */}
      <div className="relative hidden lg:flex flex-col p-12 brand-gradient text-white">
        <div className="absolute inset-0 z-0 opacity-40">
           {/* Note: In a real app, you'd use a real Image component here. Using a placeholder or generated path for now. */}
           <div className="w-full h-full bg-[url('/auth-bg.png')] bg-cover bg-center" />
        </div>
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-lg">V</div>
            VAUTH
          </Link>
        </div>

        <div className="relative z-10 mt-auto">
          <blockquote className="space-y-4">
            <p className="text-3xl font-medium leading-tight tracking-tight">
              "The most secure and intuitive way to manage your enterprise digital identity."
            </p>
            <footer className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20" />
              <div>
                <p className="font-semibold">Vivek Singh</p>
                <p className="text-sm text-white/60">CTO, VAuth Systems</p>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-8 lg:p-12 bg-white">
        <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </div>
    </div>
  )
}
