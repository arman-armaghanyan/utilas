"use client";

import Image from "next/image";
import Link from "next/link";
import {getTools, MiniTool} from "@/lib/api";
import {useEffect, useState} from "react";
import ErrorHandelComponent from "@/Components/ErrorHandelComponent";
import EmptyToolsComponent from "@/Components/EmptyToolsComponent";
import MiniToolPreviewComponent from "@/Components/MiniToolPreviewComponent";

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

      {
        error ? (
            ErrorHandelComponent({error})
      ) : tools.length === 0 ? (
            EmptyToolsComponent()
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
              MiniToolPreviewComponent({tool})
          ))}
        </div>
      )}
    </main>
  );
}
