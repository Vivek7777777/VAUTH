"use client";

import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function AuthStatus() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isPending) {
    return <div className="h-10 w-24 bg-zinc-100 animate-pulse rounded-lg" />;
  }

  if (session?.user) {
    return (
      <Button
        variant="destructive"
        className="h-10 px-8 font-bold rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
        onClick={handleLogout}
      >
        Sign Out
      </Button>
    );
  }

  return null;
}
