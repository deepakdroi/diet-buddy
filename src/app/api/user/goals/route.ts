import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { goalsSchema } from "@/schemas/goal.schema";
import type { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const goals = await prisma.userGoals.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ goals });
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
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
    const parsed = goalsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid goals payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const {
      primaryGoal,
      targetWeight,
      timeline,
      timelineDays,
      urgencyPreference,
    } = parsed.data;

    const updateData: Prisma.UserGoalsUpdateInput = {
      primaryGoal,
      targetWeight: targetWeight ?? null,
      timeline,
      timelineDays: timeline === "CUSTOM" ? (timelineDays ?? null) : null,
      urgencyPreference,
    };

    const createData: Prisma.UserGoalsCreateInput = {
      user: { connect: { id: session.user.id } },
      primaryGoal,
      targetWeight: targetWeight ?? null,
      timeline,
      timelineDays: timeline === "CUSTOM" ? (timelineDays ?? null) : null,
      urgencyPreference,
    };

    const goals = await prisma.userGoals.upsert({
      where: { userId: session.user.id },
      update: updateData,
      create: createData,
    });

    return NextResponse.json({ goals });
  } catch (error) {
    console.error("Error saving goals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
