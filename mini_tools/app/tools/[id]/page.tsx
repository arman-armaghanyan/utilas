

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, getTool } from "@/lib/api";

type ToolPageProps = {
  params: { id: string };
};

export const dynamic = "force-dynamic";

export default async function ToolDetailPage({
  params,
}: ToolPageProps) {


  const { id } = await params;

  let tool: Awaited<ReturnType<typeof getTool>> | null = null;

  try {
    tool = await getTool(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
  console.log(tool);

  if (!tool) {
    notFound();
  }


  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Back to library
      </Link>

      <header className="flex flex-col gap-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div className="relative h-44 w-full flex-shrink-0 overflow-hidden rounded-md bg-zinc-100 sm:h-36 sm:w-56">
          <Image
            src={tool.thumbnail}
            alt={tool.title}
            fill
            sizes="(min-width: 640px) 224px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <h1 className="text-3xl font-bold text-zinc-900">{tool.title}</h1>
          <p className="text-base text-zinc-600">{tool.summary}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-zinc-400">
            <span>Tool ID: {tool.id}</span>
            <span>Slug: {tool.iframeSlug}</span>
            <span>Type: {tool.appType || "html"}</span>
          </div>
        </div>
      </header>

      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Description</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          {tool.description}
        </p>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">Live Preview</h2>
          </div>
          {tool.iframeFullUrl && (
            <div className="rounded bg-blue-50 p-3 border border-blue-200">
              <p className="text-xs font-semibold text-blue-900 mb-1">Full URL (for use in other projects):</p>
              <code className="text-xs text-blue-700 break-all block">{tool.iframeFullUrl}</code>
              <p className="text-xs text-blue-600 mt-2">
                Use this URL in iframes from any domain or embed it in other projects.
              </p>
            </div>
          )}
        </div>
        <iframe
          title={tool.title}
          src={tool.iframeUrl}
          className="h-[600px] w-full rounded-md border border-zinc-200 bg-white"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          allow="fullscreen"
        />
      </section>
    </main>
  );
}

