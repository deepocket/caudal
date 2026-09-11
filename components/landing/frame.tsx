import { cn } from "@/lib/utils";

/**
 * Full-bleed band whose content sits inside the page frame. Every band draws the
 * same vertical guide lines, so they read as one continuous rail down the page.
 */
export function Band({
  id,
  className,
  frameClassName,
  children,
}: {
  id?: string;
  className?: string;
  frameClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("relative", className)}>
      <div
        className={cn(
          "relative mx-auto w-full max-w-6xl border-rail px-6 md:border-x md:px-10",
          frameClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

/** Stripe-style headline: the claim in ink, the explanation in a softer tone. */
export function TwoTone({
  as: Tag = "h2",
  strong,
  soft,
  className,
}: {
  as?: "h1" | "h2" | "h3" | "p";
  strong: React.ReactNode;
  soft?: React.ReactNode;
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        "font-medium tracking-[-0.035em] text-balance text-ink",
        className,
      )}
    >
      {strong}
      {soft ? <span className="text-ink-soft"> {soft}</span> : null}
    </Tag>
  );
}
