"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ApiError,
  MiniTool,
  MiniToolPayload,
  createTool,
  deleteTool,
  getTools,
  updateTool,
  uploadReactApp,
} from "@/lib/api";

const defaultForm: MiniToolPayload = {
  id: "",
  title: "",
  summary: "",
  description: "",
  thumbnail: "",
  iframeSlug: "",
  iframeHtml: "",
  appType: "html",
};

export default function AdminPage() {
  const [tools, setTools] = useState<MiniTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<MiniToolPayload>(defaultForm);
  const [editing, setEditing] = useState<MiniTool | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [reactAppFile, setReactAppFile] = useState<File | null>(null);

  useEffect(() => {
    refreshTools();
  }, []);

  const headerTitle = useMemo(
    () => (editing ? "Update mini tool" : "Create a new mini tool"),
    [editing]
  );

  async function refreshTools() {
    setLoading(true);
    setError(null);
    try {
      const data = await getTools();
      setTools(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load tools.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormData(defaultForm);
    setEditing(null);
    setReactAppFile(null);
  }

  function onEdit(tool: MiniTool) {
    setEditing(tool);
    setFormData({
      id: tool.id,
      title: tool.title,
      summary: tool.summary,
      description: tool.description,
      thumbnail: tool.thumbnail,
      iframeSlug: tool.iframeSlug,
      iframeHtml: tool.iframeHtml || "",
      appType: tool.appType || "html",
    });
    setReactAppFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onDelete(tool: MiniTool) {
    const confirmed = window.confirm(
      `Delete "${tool.title}"? This cannot be undone.`
    );
    if (!confirmed) {
      return;
    }

    try {
      await deleteTool(tool.id);
      setSuccessMessage(`Deleted ${tool.title}.`);
      await refreshTools();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete tool.";
      setError(message);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    if (editing && formData.id !== editing.id) {
      setError("Tool ID cannot be changed after creation.");
      setSaving(false);
      return;
    }

    try {
      if (editing) {
        const { id: preservedId, ...rest } = formData;
        // Remove iframeHtml for React apps
        if (rest.appType === "react") {
          delete rest.iframeHtml;
        }
        const updated = await updateTool(preservedId, rest);
        
        // If React app file is provided, upload it
        if (reactAppFile) {
          await uploadReactApp(preservedId, reactAppFile);
        }
        
        setSuccessMessage(`Updated ${updated.title}.`);
      } else {
        // For new tools, create first
        const payload = { ...formData };
        // Remove iframeHtml for React apps, or ensure it's present for HTML apps
        if (payload.appType === "react") {
          delete payload.iframeHtml;
        }
        
        // Validate React app has file
        if (payload.appType === "react" && !reactAppFile) {
          setError("Please upload a React app zip file.");
          setSaving(false);
          return;
        }
        
        const created = await createTool(payload);
        
        // If React app, upload the file
        if (payload.appType === "react" && reactAppFile) {
          await uploadReactApp(created.id, reactAppFile);
          setSuccessMessage(`Created ${created.title} and uploaded React app.`);
        } else {
          setSuccessMessage(`Created ${created.title}.`);
        }
      }
      resetForm();
      await refreshTools();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Unable to save tool.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  function bindField<K extends keyof MiniToolPayload>(field: K) {
    return {
      value: formData[field],
      onChange: (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) =>
        setFormData((prev) => ({
          ...prev,
          [field]: event.target.value,
        })),
    };
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Admin Panel</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Manage your catalog of mini tools. Create, update, or remove entries
            and edit the HTML rendered in iframes.
          </p>
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to library
        </Link>
      </div>

      <section className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <header>
          <h2 className="text-xl font-semibold text-zinc-900">{headerTitle}</h2>
          <p className="text-sm text-zinc-500">
            {formData.appType === "html"
              ? "Provide the iframe HTML snippet exactly as you want it rendered."
              : "Upload a zip file containing your built React app (must include index.html)."}
          </p>
        </header>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
            Tool ID
            <input
              type="text"
              placeholder="e.g. color-helper"
              className="rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              required
              {...bindField("id")}
              disabled={Boolean(editing)}
            />
            <span className="text-xs font-normal text-zinc-500">
              Used as the API identifier and URL segment.
            </span>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
            Title
            <input
              type="text"
              placeholder="Tool name"
              className="rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              required
              {...bindField("title")}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 md:col-span-2">
            Summary
            <input
              type="text"
              placeholder="Short pitch for the tool"
              className="rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              required
              {...bindField("summary")}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 md:col-span-2">
            Description
            <textarea
              placeholder="Explain what this mini tool does and how to use it."
              className="h-32 rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              required
              {...bindField("description")}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
            Thumbnail URL
            <input
              type="url"
              placeholder="https://"
              className="rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              required
              {...bindField("thumbnail")}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
            Iframe slug
            <input
              type="text"
              placeholder="color-helper"
              className="rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              required
              {...bindField("iframeSlug")}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
            App Type
            <select
              className="rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={formData.appType || "html"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  appType: e.target.value as "html" | "react",
                }))
              }
              disabled={Boolean(editing)}
            >
              <option value="html">HTML</option>
              <option value="react">React App</option>
            </select>
            {editing && (
              <span className="text-xs font-normal text-zinc-500">
                App type cannot be changed after creation.
              </span>
            )}
          </label>

          {formData.appType === "html" ? (
            <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 md:col-span-2">
              Iframe HTML
              <textarea
                placeholder="<html>...</html>"
                className="h-48 rounded border border-zinc-300 px-3 py-2 font-mono text-xs text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                required={formData.appType === "html"}
                {...bindField("iframeHtml")}
              />
            </label>
          ) : (
            <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 md:col-span-2">
              React App (ZIP file)
              <input
                type="file"
                accept=".zip,application/zip"
                className="rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setReactAppFile(file);
                  }
                }}
                required={!editing && formData.appType === "react"}
              />
              <span className="text-xs font-normal text-zinc-500">
                Upload a zip file containing your built React app. Must include index.html in the root.
              </span>
              {reactAppFile && (
                <span className="text-xs font-normal text-green-600">
                  Selected: {reactAppFile.name}
                </span>
              )}
              {editing && editing.appType === "react" && editing.reactAppUrl && (
                <span className="text-xs font-normal text-zinc-500">
                  Current app URL: {editing.reactAppUrl}
                </span>
              )}
            </label>
          )}

          <div className="flex items-center gap-3 md:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
              disabled={saving}
            >
              {saving ? "Saving..." : editing ? "Update tool" : "Create tool"}
            </button>
            {editing && (
              <button
                type="button"
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="flex flex-col gap-4">
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900">Existing tools</h2>
          <span className="text-sm text-zinc-500">
            {tools.length} item{tools.length === 1 ? "" : "s"}
          </span>
        </header>

        {loading ? (
          <div className="rounded-md border border-zinc-200 bg-white p-6 text-sm text-zinc-500 shadow-sm">
            Loading tools...
          </div>
        ) : tools.length === 0 ? (
          <div className="rounded-md border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-500 shadow-sm">
            No tools in the catalog yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {tools.map((tool) => (
              <article
                key={tool.id}
                className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {tool.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600">{tool.summary}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-zinc-400">
                    <span>ID: {tool.id}</span>
                    <span>Slug: {tool.iframeSlug}</span>
                    <span>Type: {tool.appType || "html"}</span>
                  </div>
                  {tool.iframeFullUrl && (
                    <div className="mt-2 rounded bg-zinc-50 p-2">
                      <p className="text-xs font-semibold text-zinc-700 mb-1">Full URL (for external use):</p>
                      <code className="text-xs text-zinc-600 break-all">{tool.iframeFullUrl}</code>
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
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

