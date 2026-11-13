import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { login } from "../actions";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-[#e8dfcf] px-6 text-[#2e3028]">
      <form action={login} className="w-full max-w-sm space-y-4 rounded-lg border border-[#b9aa91] bg-[#f7f1e7] p-6 shadow-[4px_6px_0_#c7bca9]">
        <h1 className="font-serif text-2xl">Adminnya Nolan aja brok</h1>
        <label className="block">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#716957]">Password</span>
          <input name="password" type="password" required autoFocus className="mt-1 w-full rounded border border-[#b9aa91] bg-[#fffdf8] px-3 py-2 text-sm" />
        </label>
        {error && <p className="text-sm text-[#9b5b4e]">Wrong password.</p>}
        <button type="submit" className="w-full rounded bg-[#2e3028] px-4 py-2 text-sm font-semibold text-[#f5efe3] hover:bg-[#4b4a3f]">Enter</button>
      </form>
    </main>
  );
}
