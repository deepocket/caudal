"use client";

import { useState } from "react";
import { Dialog } from "radix-ui";
import { Check, Maximize2, X } from "lucide-react";
import { DemoButton } from "@/components/demo-button";
import { cn } from "@/lib/utils";

export type CardDetail = {
  title: string;
  description: string;
  bullets: readonly string[];
  /** A fact from ArtroConfort's own operation, shown as proof inside the detail. */
  proof?: { value: string; label: string };
  demo?: React.ReactNode;
};

/**
 * Bento card with a live demo. The card itself stays short; the corner button
 * (or a click anywhere on the card) opens the full detail, as stripe.com does.
 */
export function ExpandableCard({
  title,
  detail,
  featured = false,
  className,
  demoClassName,
  children,
}: {
  title: string;
  detail: CardDetail;
  featured?: boolean;
  className?: string;
  demoClassName?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <article
        onClick={() => setOpen(true)}
        className={cn(
          "group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-card transition-shadow duration-300 hover:shadow-[0_24px_60px_-32px_rgba(28,58,19,0.35)]",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-6 p-6 md:p-8">
          <h3 className="max-w-md text-[1.45rem] leading-[1.15] font-medium tracking-[-0.03em] text-ink md:text-[1.7rem]">
            {title}
          </h3>
          <Dialog.Trigger asChild>
            <button
              type="button"
              aria-label={`Ver detalle: ${title}`}
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-lg transition-colors",
                featured
                  ? "bg-brand text-primary-foreground group-hover:bg-moss"
                  : "bg-mint/60 text-brand group-hover:bg-mint",
              )}
            >
              <Maximize2 className="size-4" aria-hidden />
            </button>
          </Dialog.Trigger>
        </div>
        <div className={cn("relative flex-1", demoClassName)}>{children}</div>
      </article>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#e9e6dc]/75 backdrop-blur-[3px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-x-3 top-[4vh] bottom-[4vh] z-50 mx-auto max-w-5xl overflow-y-auto rounded-2xl border border-black/10 bg-card shadow-[0_40px_120px_-40px_rgba(17,17,17,0.45)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98] md:inset-x-6">
          <div className="grid gap-10 p-6 pt-16 md:grid-cols-[1.25fr_1fr] md:gap-14 md:p-14">
            <div>
              <Dialog.Title className="text-3xl leading-[1.08] font-medium tracking-[-0.035em] text-balance text-ink md:text-[2.6rem]">
                {detail.title}
              </Dialog.Title>
              <Dialog.Description className="mt-5 text-lg leading-relaxed text-muted-foreground">
                {detail.description}
              </Dialog.Description>
              <div className="mt-8">
                <DemoButton size="hero" />
              </div>
            </div>
            <ul className="space-y-3.5 md:pt-2">
              {detail.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-[15px] leading-snug text-ink/80">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-mint text-brand">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          {detail.demo || detail.proof ? (
            <div
              className={cn(
                "grid gap-4 px-4 pb-4 md:px-14 md:pb-14",
                detail.demo && detail.proof && "md:grid-cols-[1.6fr_1fr]",
              )}
            >
              {detail.demo ? (
                <div className="river-glow relative overflow-hidden rounded-xl p-4 md:p-8">
                  {detail.demo}
                </div>
              ) : null}
              {detail.proof ? (
                <div className="gold-glow flex flex-col items-center justify-center rounded-xl px-6 py-12 text-center">
                  <p className="text-6xl font-medium tracking-[-0.05em] text-brand md:text-7xl">
                    {detail.proof.value}
                  </p>
                  <p className="mt-4 max-w-xs text-[15px] leading-snug text-ink/80">
                    {detail.proof.label}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          <Dialog.Close
            aria-label="Cerrar"
            className="absolute top-4 right-4 grid size-10 place-items-center rounded-lg bg-mint/60 text-brand transition-colors hover:bg-mint md:top-6 md:right-6"
          >
            <X className="size-5" aria-hidden />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
