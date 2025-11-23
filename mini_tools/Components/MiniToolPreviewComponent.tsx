"use client";
import {MiniTool} from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

type MiniToolPreviewComponentProps = {
    tool: MiniTool;
};

export default  function MiniToolPreviewComponent({tool}: MiniToolPreviewComponentProps) {
    return (
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
    )
}