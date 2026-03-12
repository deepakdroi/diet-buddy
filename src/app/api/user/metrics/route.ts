import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { UserMetrics } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // prisma client typings may not yet include generated models; cast to any
    const metrics = await prisma.userMetrics.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error("Error fetching user metrics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { age, gender, height, weight, bodyFatPercentage } = body;

    const metrics = await prisma.userMetrics.upsert({
      where: { userId: session.user.id },
      update: {
        age,
        gender,
        height,
        weight,
        bodyFatPercentage,
      },
      create: {
        userId: session.user.id,
        age,
        gender,
        height,
        weight,
        bodyFatPercentage,
      },
    });

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error("Error saving user metrics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}