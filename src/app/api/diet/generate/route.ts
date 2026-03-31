import { NextResponse } from "next/server";
import { generateDietPlan } from "@/lib/ai/dietPlan";

export async function POST(req: Request) {
  try {
    const userData = await req.json();

    const plan = await generateDietPlan(userData);

    console.log("🔥 GENERATED DIET PLAN:\n", plan);

    let finalPlan = plan;
    if (typeof plan === "string") {
      try {
        finalPlan = JSON.parse(plan.replace(/```json|```/g, "").trim());
      } catch (e) {
        console.error("Manual parse failed in route:", e);
      }
    }

    return NextResponse.json({ plan: finalPlan });
  } catch (err: any) {
    console.error("Diet generation error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate diet plan" },
      { status: 500 },
    );
  }
}
