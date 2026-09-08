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
      <img
        src="/caudal-wordmark.svg"
        alt="caudal"
        className="h-8 w-auto md:h-10"
      />
    </a>
  );
}
