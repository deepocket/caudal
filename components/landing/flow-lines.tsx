import { cn } from "@/lib/utils";

// The brand motif: a ribbon of fine threads that twists once and narrows into
// a single channel — many streams, one cauce. Geometry is computed once at
// module load, so server and client render the same river.

type Point = readonly [number, number];

const P0: Point = [760, -150];
const P1: Point = [1180, 210];
const P2: Point = [930, 620];
const P3: Point = [1400, 930];

function bezier(t: number): { point: Point; normal: Point } {
  const u = 1 - t;
  const x = u * u * u * P0[0] + 3 * u * u * t * P1[0] + 3 * u * t * t * P2[0] + t * t * t * P3[0];
  const y = u * u * u * P0[1] + 3 * u * u * t * P1[1] + 3 * u * t * t * P2[1] + t * t * t * P3[1];
  const dx = 3 * u * u * (P1[0] - P0[0]) + 6 * u * t * (P2[0] - P1[0]) + 3 * t * t * (P3[0] - P2[0]);
  const dy = 3 * u * u * (P1[1] - P0[1]) + 6 * u * t * (P2[1] - P1[1]) + 3 * t * t * (P3[1] - P2[1]);
  const length = Math.hypot(dx, dy) || 1;
  return { point: [x, y], normal: [-dy / length, dx / length] };
}

const THREADS = 64;
const SAMPLES = 36;

type Thread = {
  d: string;
  width: number;
  opacity: number;
  gold: boolean;
  particle: { duration: number; delay: number } | null;
};

function buildThreads(): Thread[] {
  return Array.from({ length: THREADS }, (_, i) => {
    const offset = (i / (THREADS - 1)) * 2 - 1; // -1 … 1 across the ribbon
    const points: string[] = [];
    for (let s = 0; s <= SAMPLES; s++) {
      const t = s / SAMPLES;
      const { point, normal } = bezier(t);
      // Wide where the streams arrive, narrow where they leave.
      const width = 330 - 250 * Math.pow(t, 0.9);
      // One twist: the ribbon pinches, turns over, and opens again.
      const twist = Math.cos(Math.PI * (1.25 * t + 0.08));
      const spread = offset * width * (0.06 + 0.94 * twist);
      const x = point[0] + normal[0] * spread;
      const y = point[1] + normal[1] * spread;
      points.push(`${s === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    const edge = Math.abs(offset);
    const gold = i % 11 === 5;
    return {
      d: points.join(""),
      width: gold ? 1.3 : 0.55 + edge * 0.6,
      // Edges catch more light, like the rim of a silk ribbon.
      opacity: gold ? 0.85 : 0.18 + edge * edge * 0.55,
      gold,
      particle:
        i % 4 === 1
          ? { duration: 7 + ((i * 37) % 60) / 10, delay: -((i * 53) % 120) / 10 }
          : null,
    };
  });
}

const threads = buildThreads();

/** `id` keeps gradient and mask references unique when the ribbon appears twice. */
export function FlowLines({ id = "river", className }: { id?: string; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMaxYMin slice"
      className={cn("pointer-events-none", className)}
    >
      <defs>
        <linearGradient id={id} x1="700" y1="0" x2="1150" y2="820" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--mint)" />
          <stop offset="0.3" stopColor="var(--sage)" />
          <stop offset="0.65" stopColor="var(--moss)" />
          <stop offset="1" stopColor="var(--brand)" />
        </linearGradient>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.3" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="800">
          <rect width="1200" height="800" fill={`url(#${id}-fade)`} />
        </mask>
      </defs>
      <g mask={`url(#${id}-mask)`} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {threads.map((thread, i) => (
          <path
            key={i}
            d={thread.d}
            stroke={thread.gold ? "var(--gold)" : `url(#${id})`}
            strokeWidth={thread.width}
            strokeOpacity={thread.opacity}
          />
        ))}
        {threads.map((thread, i) =>
          thread.particle ? (
            <path
              key={`p${i}`}
              d={thread.d}
              pathLength={400}
              stroke={thread.gold ? "#fff6dc" : "var(--gold)"}
              strokeWidth={thread.gold ? 2.2 : 1.7}
              strokeDasharray="6 394"
              className="flow-particle"
              style={{
                animationDuration: `${thread.particle.duration}s`,
                animationDelay: `${thread.particle.delay}s`,
              }}
            />
          ) : null,
        )}
      </g>
    </svg>
  );
}
