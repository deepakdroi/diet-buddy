import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { UserActivityLevel } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activityLevel = await prisma.userActivityLevel.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ activityLevel });
  } catch (error) {
    console.error("Error fetching user activity level:", error);
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
    const {
      dailyActivityLevel,
      exerciseFrequency,
      exerciseTypes,
      averageWorkoutDuration,
    } = body;
    const safeExerciseTypes = exerciseTypes ?? [];
    const activityLevel = await prisma.userActivityLevel.upsert({
      where: { userId: session.user.id },
      update: {
        dailyActivityLevel,
        exerciseFrequency,
        exerciseTypes: safeExerciseTypes,
        averageWorkoutDuration,
      },
      create: {
        userId: session.user.id,
        dailyActivityLevel,
        exerciseFrequency,
        exerciseTypes: safeExerciseTypes,
        averageWorkoutDuration,
      },
    });

    return NextResponse.json({ activityLevel });
  } catch (error) {
    console.error("Error saving user activity level:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
