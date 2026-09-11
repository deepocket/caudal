import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

/** Minimal browser chrome so a demo reads as the real web app, not an illustration. */
export function BrowserFrame({
  path,
  className,
  children,
}: {
  path: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_30px_70px_-36px_rgba(17,17,17,0.4)]",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-black/[0.06] bg-[#f7f6f2] px-3.5 py-2.5">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-black/10" />
          <span className="size-2.5 rounded-full bg-black/10" />
          <span className="size-2.5 rounded-full bg-black/10" />
        </div>
        <div className="mx-auto flex max-w-[60%] items-center gap-1.5 truncate rounded-full bg-white px-3 py-1 text-[10.5px] text-black/45 ring-1 ring-black/[0.06]">
          <Lock className="size-2.5 shrink-0" aria-hidden />
          <span className="truncate">app.trycaudal.com/{path}</span>
        </div>
        <div className="w-[42px]" />
      </div>
      {children}
    </div>
  );
}
