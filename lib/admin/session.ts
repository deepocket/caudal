import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

// One owner, one password. The session is a signed expiry date in an httpOnly
// cookie: nothing to store, and changing the password or the secret signs
// every device out.

const COOKIE = "caudal_admin";
const PATH = "/admin";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days, in seconds

type Credentials = { password: string; secret: string };

function credentials(): Credentials | null {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  return password && secret ? { password, secret } : null;
}

export function isAdminConfigured() {
  return credentials() !== null;
}

/** Constant-time comparison of two strings of any length. */
function same(a: string, b: string) {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(a), digest(b));
}

function sign(expires: string, { password, secret }: Credentials) {
  return createHmac("sha256", secret).update(`${expires}.${password}`).digest("base64url");
}

export function passwordMatches(input: string) {
  const current = credentials();
  return current !== null && same(input, current.password);
}

export async function startSession() {
  const current = credentials();
  if (!current) throw new Error("ADMIN_PASSWORD o ADMIN_SESSION_SECRET sin configurar");
  const expires = String(Date.now() + MAX_AGE * 1000);
  (await cookies()).set(COOKIE, `${expires}.${sign(expires, current)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: PATH,
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete({ name: COOKIE, path: PATH });
}

/** Memoized per request, so a page and its actions can all ask. */
export const hasSession = cache(async () => {
  const current = credentials();
  const value = (await cookies()).get(COOKIE)?.value;
  if (!current || !value) return false;
  const [expires, signature] = value.split(".");
  if (!signature || !(Number(expires) > Date.now())) return false;
  return same(signature, sign(expires, current));
});

/** Every admin page and action calls this first: no session, back to the login. */
export async function requireSession() {
  if (!(await hasSession())) redirect("/admin/login");
}
