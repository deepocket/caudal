import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { hasSession, isAdminConfigured } from "@/lib/admin/session";

export default async function AdminLoginPage() {
  if (await hasSession()) redirect("/admin");

  return (
    <main className="grid flex-1 place-items-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/caudal-wordmark.svg" alt="caudal" width={107} height={40} className="h-8 w-auto" />
        <h1 className="mt-8 text-[1.6rem] leading-tight font-medium tracking-[-0.03em] text-ink">
          Solicitudes
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          Los contactos que llegan desde el formulario de la página.
        </p>
        {isAdminConfigured() ? (
          <LoginForm />
        ) : (
          <p className="mt-8 rounded-lg bg-secondary px-4 py-3 text-[14px] leading-relaxed text-ink">
            Para entrar, define <code className="font-mono text-[13px]">ADMIN_PASSWORD</code> y{" "}
            <code className="font-mono text-[13px]">ADMIN_SESSION_SECRET</code> en las variables de
            entorno (ver el README).
          </p>
        )}
      </div>
    </main>
  );
}
