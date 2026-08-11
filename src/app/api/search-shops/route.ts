import { NextResponse } from "next/server";
import { buildMockResults } from "@/lib/mock-data";
import type { SearchShopsRequest } from "@/types/outreach";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SearchShopsRequest;

    if (!body.location?.trim()) {
      return NextResponse.json({ error: "Location is required." }, { status: 400 });
    }

    if (!body.businessCategory?.trim()) {
      return NextResponse.json({ error: "Business category is required." }, { status: 400 });
    }

    const radiusKm = Number(body.radiusKm);
    if (Number.isNaN(radiusKm) || radiusKm < 1 || radiusKm > 50) {
      return NextResponse.json(
        { error: "Search radius must be between 1 and 50 km." },
        { status: 400 }
      );
    }

    // Simulate external business search latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const results = buildMockResults({
      location: body.location.trim(),
      radiusKm,
      businessCategory: body.businessCategory.trim(),
      messageTemplate:
        body.messageTemplate?.trim() ||
        "Hello {shop_name}! We noticed your {business_category} in {location}.",
    });

    return NextResponse.json({
      results,
      meta: {
        location: body.location.trim(),
        businessCategory: body.businessCategory.trim(),
        radiusKm,
        count: results.length,
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}
