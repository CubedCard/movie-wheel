export const SESSION_COOKIE = "mw_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  "movie-wheel-dev-secret-change-me-in-production";

const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return toHex(digest);
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return toHex(signature);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function safeEqual(a: string, b: string): Promise<boolean> {
  const [hashA, hashB] = await Promise.all([sha256Hex(a), sha256Hex(b)]);
  return constantTimeEqual(hashA, hashB);
}

export async function checkCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const [userOk, passOk] = await Promise.all([
    safeEqual(username, ADMIN_USERNAME),
    safeEqual(password, ADMIN_PASSWORD),
  ]);
  return userOk && passOk;
}

export async function createSessionToken(): Promise<{ token: string; maxAge: number }> {
  const expires = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `admin.${expires}`;
  const signature = await hmacSha256Hex(SESSION_SECRET, payload);
  return { token: `${payload}.${signature}`, maxAge: SESSION_MAX_AGE_SECONDS };
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, expiresStr, signature] = parts;
  const payload = `${role}.${expiresStr}`;
  const expectedSignature = await hmacSha256Hex(SESSION_SECRET, payload);
  if (!constantTimeEqual(signature, expectedSignature)) return false;
  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;
  return role === "admin";
}
