import { NextResponse } from "next/server";
import { getAllBoxes, upsertBox, deleteBox } from "@/lib/db";
import type { Box } from "@/types/screenguard";

// Force this route to be dynamic — never statically pre-rendered at build time.
// Required because it calls Supabase which needs runtime env vars.
export const dynamic = "force-dynamic";

// ─── GET /api/screenguards ────────────────────────────────────────────────────
// Returns all boxes from Supabase as { boxes: Box[] }
export async function GET() {
  try {
    const boxes = await getAllBoxes();
    return NextResponse.json(
      { boxes, totalBoxes: boxes.length },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch data", details: message },
      { status: 500 }
    );
  }
}

// ─── POST /api/screenguards ───────────────────────────────────────────────────
// Body: { action: "upsert", box: Box }
//       { action: "delete", id: string }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "upsert") {
      const box: Box = body.box;
      if (!box || !box.id || !box.boxNumber) {
        return NextResponse.json(
          { error: "Invalid box data — id and boxNumber are required" },
          { status: 400 }
        );
      }
      const saved = await upsertBox(box);
      return NextResponse.json({ success: true, box: saved });
    }

    if (action === "delete") {
      const { id } = body;
      if (!id) {
        return NextResponse.json(
          { error: "id is required for delete" },
          { status: 400 }
        );
      }
      await deleteBox(id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: `Unknown action: ${action}` },
      { status: 400 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Request failed", details: message },
      { status: 500 }
    );
  }
}
