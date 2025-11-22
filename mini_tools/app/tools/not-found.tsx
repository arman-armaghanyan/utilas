import Link from "next/link";

export default function ToolNotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <h1 className="text-3xl font-semibold text-zinc-900">
        Tool not found
      </h1>
      <p className="text-zinc-600">
        We couldn’t locate the mini tool you’re looking for. It may have been
        removed or renamed.
      </p>
      <Link
        href="/"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        Return to the library
      </Link>
    </main>
  );
}

