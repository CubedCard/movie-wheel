import { NextResponse } from "next/server";
import { deleteMovie } from "@/lib/movies";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteMovie(id);
  return NextResponse.json({ ok: true });
}
