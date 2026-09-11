import { llmsTxt } from "@/lib/agent-content";

// https://llmstxt.org: a short Markdown map of the site for AI agents.
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
