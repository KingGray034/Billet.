import { NextResponse } from "next/server";
import { clearSession } from "@/server/auth";

export async function POST() {
  await clearSession();
  return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL!);
}