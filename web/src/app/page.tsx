import Link from "next/link";
import { getMovies } from "@/lib/movies";
import MovieWheel from "@/components/MovieWheel";

export const dynamic = "force-dynamic";

export default async function Home() {
  const movies = await getMovies();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-neutral-950 px-4 py-10 text-neutral-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Movie Wheel</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Can&apos;t decide what to watch? Spin the wheel.
        </p>
      </div>
      <MovieWheel movies={movies} />
      <Link
        href="/admin"
        className="text-xs text-neutral-600 underline-offset-4 hover:text-neutral-400 hover:underline"
      >
        Admin
      </Link>
    </main>
  );
}
