import { getMovies } from "@/lib/movies";
import AdminMovieManager from "./AdminMovieManager";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const movies = await getMovies();
  return <AdminMovieManager initialMovies={movies} />;
}
