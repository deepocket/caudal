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
    <a
      href={href}
      aria-label={site.name}
      className={cn("wordmark text-brand lowercase", className)}
    >
      {site.wordmark}
    </a>
  );
}
