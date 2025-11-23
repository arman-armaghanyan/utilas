"use client";

import { ChangeEvent, useEffect } from "react";
import { MiniTool, MiniToolPayload } from "@/lib/api";

type ToolFormModalProps = {
  bindField: <K extends keyof MiniToolPayload>(
      field: K
  ) => {
    onChange: (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    value: MiniToolPayload[K];
  };
  editing: MiniTool | null;
  error: string | null;
  formData: MiniToolPayload;
  headerTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  reactAppFile: File | null;
  saving: boolean;
  setFormData: React.Dispatch<React.SetStateAction<MiniToolPayload>>;
  setReactAppFile: React.Dispatch<React.SetStateAction<File | null>>;
  successMessage: string | null;
};

export default function ToolFormModal({
  isOpen,
  formData,
  editing,
  error,
  successMessage,
  saving,
  reactAppFile,
  headerTitle,
  onClose,
  onSubmit,
  bindField,
  setFormData,
  setReactAppFile,
}: ToolFormModalProps) {
  // Handle ESC key to close modal
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-xl">
        <section className="flex flex-col gap-4 p-6">
          <header className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                {headerTitle}
              </h2>
              <p className="text-sm text-zinc-500">
                {formData.appType === "html"
                  ? "Provide the iframe HTML snippet exactly as you want it rendered."
                  : "Upload a zip file containing your built React app (must include index.html)."}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
              aria-label="Close modal"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
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
                  onClick={onClose}
                  disabled={saving}
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

