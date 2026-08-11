import { NextResponse } from "next/server";
import type { SendMessagesRequest } from "@/types/outreach";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SendMessagesRequest;

    if (!body.messages?.length) {
      return NextResponse.json({ error: "At least one message is required." }, { status: 400 });
    }

    const sent: string[] = [];
    const failed: string[] = [];

    // Simulate outbound messaging with occasional failure
    for (const item of body.messages) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!item.phone?.trim()) {
        failed.push(item.id);
        continue;
      }

      // ~10% simulated failure rate for demo purposes
      if (Math.random() < 0.1) {
        failed.push(item.id);
      } else {
        sent.push(item.id);
      }
    }

    return NextResponse.json({ sent, failed });
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}
