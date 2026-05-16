import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ user: null });
  }

  return Response.json({
    user: session.user,
    session: session.session,
  });
}
