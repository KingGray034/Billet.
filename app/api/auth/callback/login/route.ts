import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/server/auth";
import prisma from "@/server/db";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url));
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/login`,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();

    if (!tokens.access_token) {
      console.error("No access token returned:", tokens);
      return NextResponse.redirect(new URL("/?error=login_failed", request.url));
    }

    // Fetch user profile from Google
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const profile = await profileRes.json();

    if (!profile.id) {
      console.error("No profile id returned:", profile);
      return NextResponse.redirect(new URL("/?error=login_failed", request.url));
    }

    // Find or create the user
    const user = await prisma.user.upsert({
      where: { googleId: profile.id },
      update: { name: profile.name, image: profile.picture },
      create: {
        googleId: profile.id,
        email: profile.email,
        name: profile.name,
        image: profile.picture,
      },
    });

    // Auto-clear demo data on login so user starts with a clean slate
    const demoApps = await prisma.application.findMany({
      where: { isDemo: true },
      select: { id: true },
    });
    const demoAppIds = demoApps.map((a) => a.id);
    if (demoAppIds.length > 0) {
      await prisma.aiSuggestion.deleteMany({ where: { applicationId: { in: demoAppIds } } });
      await prisma.interview.deleteMany({ where: { applicationId: { in: demoAppIds } } });
      await prisma.document.deleteMany({ where: { applicationId: { in: demoAppIds } } });
      await prisma.application.deleteMany({ where: { isDemo: true } });
    }
    await prisma.company.deleteMany({
      where: { isDemo: true, applications: { none: {} } },
    });

    // Set session cookie
    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name ?? "",
    });

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.redirect(new URL("/?error=login_failed", request.url));
  }
}