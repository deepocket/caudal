import { cn } from "@/lib/utils";

// Small pieces of the real Caudal app (ac-logistics) rebuilt for the demos:
// Inter, #1B3A2D primary, #4A9D7C accent, gray fills instead of borders,
// rounded-full status chips and tabular numbers.

/** Root for every demo: the app's type, colors and number style. */
export function AppSurface({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "font-app text-[12px] leading-snug tracking-[-0.011em] text-app-ink tabular-nums select-none",
        className,
      )}
    >
      {children}
    </div>
  );
}

export type ChipTone =
  | "gray"
  | "green"
  | "emerald"
  | "gold"
  | "amber"
  | "red"
  | "dark";

const chipTones: Record<ChipTone, string> = {
  gray: "bg-app-fill text-app-muted",
  green: "bg-app-green-50 text-app-primary",
  emerald: "bg-emerald-50 text-emerald-700",
  gold: "bg-app-gold-50 text-app-gold-700",
  amber: "bg-amber-50 text-app-amber",
  red: "bg-red-50 text-app-red",
  dark: "bg-app-primary text-white",
};

export function Chip({
  tone = "gray",
  className,
  children,
}: {
  tone?: ChipTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium whitespace-nowrap",
        chipTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function AppButton({
  variant = "primary",
  className,
  children,
}: {
  variant?: "primary" | "accent" | "outline";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap transition-colors duration-300",
        variant === "primary" && "bg-app-primary text-white",
        variant === "accent" && "bg-app-accent text-white",
        variant === "outline" && "bg-white text-app-ink ring-1 ring-black/10",
        className,
      )}
    >
      {children}
    </span>
  );
}

const avatarColors = ["#1b3a2d", "#4a9d7c", "#7a5b12", "#3f6ea8", "#9b4d7a"];

export function Avatar({
  initials,
  tone = 0,
  className,
}: {
  initials: string;
  tone?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid size-5 shrink-0 place-items-center rounded-full text-[8.5px] font-semibold text-white ring-2 ring-white",
        className,
      )}
      style={{ backgroundColor: avatarColors[tone % avatarColors.length] }}
    >
      {initials}
    </span>
  );
}

/** Phone chrome for the mobile-only flows (the lot scanner lives on the phone). */
export function PhoneFrame({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative w-[230px] rounded-[2.2rem] bg-[#0f1411] p-[7px] shadow-[0_30px_70px_-30px_rgba(17,17,17,0.55)]",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[1.8rem] bg-white">
        <div className="absolute top-2 left-1/2 z-10 h-[18px] w-[72px] -translate-x-1/2 rounded-full bg-[#0f1411]" />
        {children}
      </div>
    </div>
  );
}

const pesos = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
});

const pesosRounded = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

/** Money as the app shows it: `$12,345.67`, or without cents on dashboard tiles. */
export function money(amount: number, { cents = true } = {}) {
  return (cents ? pesos : pesosRounded).format(amount);
}
