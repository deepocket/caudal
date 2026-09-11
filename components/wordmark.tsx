import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

export function Wordmark({
  className,
  href = "#top",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <a href={href} aria-label={site.name} className={cn("inline-flex", className)}>
      {/* Locked vector wordmark: served as-is, never re-rendered as live type. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/caudal-wordmark.svg"
        alt="caudal"
        width={107}
        height={40}
        className="h-8 w-auto md:h-10"
      />
    </a>
  );
}
