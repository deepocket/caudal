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
      className={cn(
        "text-brand font-medium tracking-[-0.04em] lowercase",
        className,
      )}
    >
      {site.wordmark}
    </a>
  );
}
