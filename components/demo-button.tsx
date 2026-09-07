import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function DemoButton({
  className,
  size = "header",
}: {
  className?: string;
  size?: "header" | "hero";
}) {
  return (
    <Button
      asChild
      className={cn(
        "bg-brand text-primary-foreground hover:bg-brand/90 rounded-md font-medium shadow-none",
        size === "header" && "h-9 px-3.5 text-sm",
        size === "hero" && "h-12 px-5 text-[15px]",
        className,
      )}
    >
      <a href={site.demoHref}>Agendar demo</a>
    </Button>
  );
}
