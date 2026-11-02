import { NextRequest, NextResponse } from "next/server";
import { addMovie, getMovies } from "@/lib/movies";

export const dynamic = "force-dynamic";

export async function GET() {
  const movies = await getMovies();
  return NextResponse.json({ movies });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const imageUrl = typeof body?.imageUrl === "string" ? body.imageUrl.trim() : "";
  const yearRaw = body?.year;
  const year =
    yearRaw === undefined || yearRaw === null || yearRaw === ""
      ? undefined
      : Number(yearRaw);

  if (!title || !imageUrl) {
    return NextResponse.json(
      { error: "title and imageUrl are required" },
      { status: 400 }
    );
  }
  if (year !== undefined && !Number.isFinite(year)) {
    return NextResponse.json({ error: "year must be a number" }, { status: 400 });
  }

  const movie = await addMovie({ title, imageUrl, year });
  return NextResponse.json({ movie }, { status: 201 });
}
