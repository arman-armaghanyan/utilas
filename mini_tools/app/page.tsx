"use client";

import Image from "next/image";
import Link from "next/link";
import {getTools, MiniTool} from "@/lib/api";
import {useEffect, useState} from "react";

export const dynamic = "force-dynamic";

export default  function HomePage() {
  const [tools, setTools] = useState<MiniTool[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refreshTools();
  }, []);

  async function refreshTools() {
    setError(null);
    try {
      const data = await getTools();
      setTools(data);
    } catch (err) {
      const message =
          err instanceof Error ? err.message : "Failed to load tools.";
      setError(message);
    } finally {
    }
  }
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <section className="flex flex-col gap-4 text-center sm:text-left">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
          Mini Tools Library
        </h1>
        <p className="text-lg text-zinc-600">
          Explore bite-sized utilities to embed inside your product, or dive
          into the admin area to curate your own collection.
        </p>
      </section>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      ) : tools.length === 0 ? (
        <div className="rounded-md border border-zinc-200 bg-white p-10 text-center text-zinc-500 shadow-sm">
          No tools yet. Visit the admin panel to add your first tool.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <article
              key={tool.id}
              className="flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-40 w-full bg-zinc-100">
                <Image
                  src={tool.thumbnail}
                  alt={tool.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">
                    {tool.title}
                  </h2>
                  <p className="mt-2 text-sm text-zinc-600">{tool.summary}</p>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <Link
                    href={`/tools/${tool.id}`}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    View details
                  </Link>
                  <span className="text-xs uppercase tracking-wide text-zinc-400">
                    #{tool.id}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
