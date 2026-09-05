import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("billet_session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    // Token is invalid or expired, clear it and redirect
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("billet_session");
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/application/:path*"],
};