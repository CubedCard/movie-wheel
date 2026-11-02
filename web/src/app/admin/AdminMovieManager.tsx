"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Movie } from "@/lib/movies";

export default function AdminMovieManager({
  initialMovies,
}: {
  initialMovies: Movie[];
}) {
  const router = useRouter();
  const [movies, setMovies] = useState(initialMovies);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, year: year || undefined, imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to add movie");
        return;
      }
      setMovies((prev) => [...prev, data.movie]);
      setTitle("");
      setYear("");
      setImageUrl("");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/movies/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMovies((prev) => prev.filter((m) => m.id !== id));
    }
  }

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-8 text-neutral-100">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Manage movies</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-neutral-400 underline-offset-4 hover:text-neutral-200 hover:underline"
            >
              View wheel
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-md border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800"
            >
              Log out
            </button>
          </div>
        </div>

        <form
          onSubmit={handleAdd}
          className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900 p-6"
        >
          <h2 className="text-lg font-medium">Add a movie</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-sm text-neutral-300" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm text-neutral-300" htmlFor="year">
                Year (optional)
              </label>
              <input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-sm text-neutral-300" htmlFor="imageUrl">
                Poster image URL
              </label>
              <input
                id="imageUrl"
                type="url"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add movie"}
          </button>
        </form>

        <div className="space-y-3">
          <h2 className="text-lg font-medium">
            Collection ({movies.length})
          </h2>
          {movies.length === 0 && (
            <p className="text-sm text-neutral-500">No movies yet. Add one above.</p>
          )}
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {movies.map((movie) => (
              <li
                key={movie.id}
                className="group relative overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={movie.imageUrl}
                  alt={movie.title}
                  className="aspect-[2/3] w-full object-cover"
                />
                <div className="p-2">
                  <p className="truncate text-sm font-medium">{movie.title}</p>
                  {movie.year && (
                    <p className="text-xs text-neutral-500">{movie.year}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(movie.id)}
                  className="absolute right-2 top-2 rounded-md bg-red-600/90 px-2 py-1 text-xs font-medium text-white"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
