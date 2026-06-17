import { NextResponse } from "next/server";

import { getOpenCounts } from "@/lib/openCounts";

export const dynamic = "force-dynamic";

/**
 * Global open counts as { [appId]: count }. The client sorts Trending with
 * this. Short CDN cache (30s) keeps Redis reads cheap while staying fresh; an
 * empty map (storage not configured / no opens yet) is a valid response.
 */
export async function GET() {
  try {
    const counts = await getOpenCounts();
    return NextResponse.json(
      { counts },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("[trending] failed", error);
    return NextResponse.json({ counts: {} }, { status: 200 });
  }
}
