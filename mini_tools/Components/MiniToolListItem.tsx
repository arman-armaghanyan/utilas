"use client";

import Link from "next/link";
import { MiniTool } from "@/lib/api";

type MiniToolListItemProps = {
  tool: MiniTool;
  onEdit: (tool: MiniTool) => void;
  onDelete: (tool: MiniTool) => void;
  saving: boolean;
  editing: MiniTool | null;
};

export default function MiniToolListItem({
  tool,
  onEdit,
  onDelete,
  saving,
  editing,
}: MiniToolListItemProps) {
  return (
    <article
      className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
    >
      <div>
        <h3 className="text-lg font-semibold text-zinc-900">{tool.title}</h3>
        <p className="mt-1 text-sm text-zinc-600">{tool.summary}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-zinc-400">
          <span>ID: {tool.id}</span>
          <span>Slug: {tool.iframeSlug}</span>
          <span>Type: {tool.appType || "html"}</span>
        </div>
        {tool.iframeFullUrl && (
          <div className="mt-2 rounded bg-zinc-50 p-2">
            <p className="text-xs font-semibold text-zinc-700 mb-1">
              Full URL (for external use):
            </p>
            <code className="text-xs text-zinc-600 break-all">
              {tool.iframeFullUrl}
            </code>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/tools/${tool.id}`}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
          target="_blank"
        >
          View
        </Link>
        <button
          type="button"
          className="rounded-md border border-blue-500 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
          onClick={() => onEdit(tool)}
          disabled={saving && editing?.id === tool.id}
        >
          Edit
        </button>
        <button
          type="button"
          className="rounded-md border border-red-500 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          onClick={() => onDelete(tool)}
          disabled={saving}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

