import { NextResponse } from "next/server";
import { generateDietPlan } from "@/lib/ai/dietPlan";

export async function POST(req: Request) {
  try {
    const userData = await req.json();

    const plan = await generateDietPlan(userData);

    console.log("🔥 GENERATED DIET PLAN:\n", plan);

    return NextResponse.json({ plan });
  } catch (err) {
    console.error("Diet generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate diet plan" },
      { status: 500 },
    );
  }
}
