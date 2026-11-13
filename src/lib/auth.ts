import { cookies } from "next/headers";

const COOKIE = "bloomnote_admin";

export function adminPassword() {
  return process.env.ADMIN_PASSWORD ?? "notha2026";
}

export async function isAdmin() {
  const store = await cookies();
  return store.get(COOKIE)?.value === adminPassword();
}

export async function signIn(password: string) {
  if (password !== adminPassword()) return false;
  const store = await cookies();
  store.set(COOKIE, password, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
  return true;
}

export async function signOut() {
  const store = await cookies();
  store.delete(COOKIE);
}
