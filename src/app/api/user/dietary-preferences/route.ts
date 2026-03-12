import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prefs = await prisma.userDietaryPreferences.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ prefs });
  } catch (error) {
    console.error("Error fetching dietary preferences:", error);
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
    const { dietType, mealsPerDay, cookingTimePreference, budgetPreference } = body;

    // build typed payloads so TS can verify fields
    const updateData: Prisma.UserDietaryPreferencesUpdateInput = {
      dietType,
      mealsPerDay,
      cookingTimePreference,
      budgetPreference,
    };

    const createData: Prisma.UserDietaryPreferencesCreateInput = {
      user: { connect: { id: session.user.id } },
      dietType,
      mealsPerDay,
      cookingTimePreference,
      budgetPreference,
    };

    const prefs = await prisma.userDietaryPreferences.upsert({
      where: { userId: session.user.id },
      update: updateData,
      create: createData,
    });

    return NextResponse.json({ prefs });
  } catch (error) {
    console.error("Error saving dietary preferences:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}