import { promises as fs } from "fs";
import path from "path";

export type Movie = {
  id: string;
  title: string;
  year?: number;
  imageUrl: string;
  createdAt: string;
};

const DATA_FILE = path.join(process.cwd(), "data", "movies.json");

async function readAll(): Promise<Movie[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Movie[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeAll(movies: Movie[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(movies, null, 2));
}

export async function getMovies(): Promise<Movie[]> {
  return readAll();
}

export async function addMovie(input: {
  title: string;
  year?: number;
  imageUrl: string;
}): Promise<Movie> {
  const movies = await readAll();
  const movie: Movie = {
    id: crypto.randomUUID(),
    title: input.title,
    year: input.year,
    imageUrl: input.imageUrl,
    createdAt: new Date().toISOString(),
  };
  movies.push(movie);
  await writeAll(movies);
  return movie;
}

export async function deleteMovie(id: string): Promise<void> {
  const movies = await readAll();
  await writeAll(movies.filter((m) => m.id !== id));
}
