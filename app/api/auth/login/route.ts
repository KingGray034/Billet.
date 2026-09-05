import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";

export async function GET(request: NextRequest) {
  // Already logged in — skip Google and go straight to dashboard
  const user = await getCurrentUser();
  if (user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/login`,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
  );
}