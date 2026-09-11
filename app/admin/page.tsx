import { LogOut } from "lucide-react";
import { LeadsBoard } from "@/components/admin/leads-board";
import { logout } from "@/lib/admin/actions";
import { requireSession } from "@/lib/admin/session";
import { getLeadStore } from "@/lib/leads/store";
import type { Lead } from "@/lib/leads/types";

export default async function AdminPage() {
  await requireSession();

  const store = getLeadStore();
  let leads: Lead[] = [];
  let loadFailed = false;
  if (store) {
    try {
      leads = await store.list();
    } catch (error) {
      console.error("[admin] No se pudieron leer las solicitudes:", error);
      loadFailed = true;
    }
  }

  return (
    <>
      <header className="border-b border-rail">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/caudal-wordmark.svg" alt="caudal" width={107} height={40} className="h-7 w-auto" />
          <span className="h-5 w-px bg-black/10" aria-hidden />
          <h1 className="text-[15px] font-medium text-ink">Solicitudes</h1>
          <form action={logout} className="ml-auto">
            <button
              type="submit"
              className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-[14px] text-muted-foreground transition-colors hover:bg-black/5 hover:text-ink"
            >
              <LogOut className="size-4" aria-hidden />
              Salir
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-8">
        <LeadsBoard leads={leads} storage={store?.kind ?? null} loadFailed={loadFailed} />
      </main>
    </>
  );
}
