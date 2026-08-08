import { buildBlogFeed } from "@/lib/blog-feed";

/** Feed RSS do locale default (en), em `/blog/feed.xml`. Gerado no build. */
export const dynamic = "force-static";

export function GET() {
  return new Response(buildBlogFeed("en"), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
