import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, checkCredentials, createSessionToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!(await checkCredentials(username, password))) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const { token, maxAge } = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  return response;
}
