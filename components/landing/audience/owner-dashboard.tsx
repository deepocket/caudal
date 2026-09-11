"use client";

import { useInView, useDemoStep, usePrefersReducedMotion } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

// Weekly totals in thousands of pesos. Fictional, shaped like a healthy month:
// sales lead, income follows, purchases stay under both.
const series = [
  { key: "ventas", label: "Ventas", color: "#e6efd9", values: [22, 31, 26, 35, 30, 41, 38, 46] },
  { key: "ingresos", label: "Ingresos", color: "#7fd0a8", values: [14, 18, 21, 19, 25, 24, 31, 34] },
  { key: "compras", label: "Compras", color: "#d9a441", values: [12, 9, 15, 13, 11, 16, 14, 17] },
] as const;

const kpis = [
  { label: "Ventas", value: "$412,860" },
  { label: "Tasa de cierre", value: "41%" },
  { label: "Por cobrar", value: "$186,420" },
] as const;

const W = 300;
const H = 150;
const PAD = 8;
const MAX = 50;

function points(values: readonly number[]) {
  const stepX = (W - PAD * 2) / (values.length - 1);
  return values.map((v, i) => [PAD + i * stepX, H - PAD - (v / MAX) * (H - PAD * 2)] as const);
}

// Catmull-Rom through the points, written as cubic Béziers.
function smooth(pts: ReturnType<typeof points>) {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[Math.max(i - 1, 0)];
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const [x3, y3] = pts[Math.min(i + 2, pts.length - 1)];
    const c1x = x1 + (x2 - x0) / 6;
    const c1y = y1 + (y2 - y0) / 6;
    const c2x = x2 - (x3 - x1) / 6;
    const c2y = y2 - (y3 - y1) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  return d;
}

const lines = series.map((s) => {
  const pts = points(s.values);
  return { ...s, d: smooth(pts), end: pts[pts.length - 1] };
});

export function OwnerDashboard() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reducedMotion = usePrefersReducedMotion();
  const step = useDemoStep(lines.length, 2600, inView);
  // Lines draw while on screen; with reduced motion they are simply there.
  const drawn = inView || reducedMotion;
  const focus = reducedMotion ? null : step;

  return (
    <div ref={ref} aria-hidden className="absolute inset-0 p-5 font-app tabular-nums">
      <div className="grid grid-cols-3 gap-2">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl bg-white/[0.07] px-2.5 py-2 ring-1 ring-white/10"
          >
            <p className="truncate text-[10px] text-white/55">{kpi.label}</p>
            <p className="mt-0.5 text-[15px] font-semibold tracking-[-0.02em] text-white">
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-2.5 rounded-xl bg-white/[0.05] p-3 ring-1 ring-white/10">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold text-white">Ventas vs Ingresos vs Compras</p>
          <p className="text-[10px] text-white/45">Sep 2026</p>
        </div>
        <div className="mt-1.5 flex gap-3">
          {lines.map((line, index) => (
            <span
              key={line.key}
              className={cn(
                "flex items-center gap-1 text-[10px] transition-opacity duration-500",
                focus === null || focus === index ? "text-white/80" : "text-white/35",
              )}
            >
              <span className="size-1.5 rounded-full" style={{ backgroundColor: line.color }} />
              {line.label}
            </span>
          ))}
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 h-auto w-full overflow-visible">
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1={PAD}
              x2={W - PAD}
              y1={PAD + f * (H - PAD * 2)}
              y2={PAD + f * (H - PAD * 2)}
              stroke="white"
              strokeOpacity={0.08}
              strokeDasharray="3 4"
            />
          ))}
          {lines.map((line, index) => {
            const active = focus === null || focus === index;
            return (
              <g key={line.key} className="transition-opacity duration-500" opacity={active ? 1 : 0.35}>
                <path
                  d={line.d}
                  fill="none"
                  stroke={line.color}
                  strokeWidth={active && focus !== null ? 2.4 : 1.8}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={drawn ? 0 : 1}
                  style={{
                    transition: reducedMotion
                      ? undefined
                      : `stroke-dashoffset 1.6s cubic-bezier(0.22,1,0.36,1) ${index * 0.18}s, stroke-width 0.4s`,
                  }}
                />
                <circle
                  cx={line.end[0]}
                  cy={line.end[1]}
                  r={3}
                  fill={line.color}
                  className="transition-opacity duration-500"
                  opacity={drawn ? 1 : 0}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
