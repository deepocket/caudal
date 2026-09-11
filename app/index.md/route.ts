import { pageMarkdown } from "@/lib/agent-content";

// The whole landing as one Markdown document. Agents asking "/" for
// text/markdown are rewritten here (see next.config.ts).
export const dynamic = "force-static";

export function GET() {
  return new Response(pageMarkdown(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
