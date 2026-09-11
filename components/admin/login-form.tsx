"use client";

import { useActionState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { login, type LoginState } from "@/lib/admin/actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-8 rounded-2xl border border-black/[0.08] bg-card p-6">
      <label htmlFor="admin-password" className="text-[14px] font-medium text-ink">
        Contraseña
      </label>
      <input
        id="admin-password"
        name="password"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        aria-invalid={state.error ? true : undefined}
        aria-describedby={state.error ? "admin-password-error" : undefined}
        className="mt-2 h-11 w-full rounded-lg border border-black/10 bg-background px-3.5 text-[15px] text-ink transition-colors outline-none focus:border-moss focus:ring-3 focus:ring-moss/15 aria-invalid:border-red-700/60"
      />
      {state.error ? (
        <p id="admin-password-error" role="alert" className="mt-2 text-[13px] text-red-700">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand px-5 text-[15px] font-medium text-primary-foreground transition-colors hover:bg-brand/90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-70"
      >
        {pending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden />
            Entrando…
          </>
        ) : (
          <>
            Entrar
            <ArrowRight className="size-4" aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}
