import { MealType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

type DietPlanFoodPayload = {
  name?: string;
  quantity?: number | string;
  unit?: string;
  proteinG?: number | string;
  calories?: number | string;
};

type DietPlanMealPayload = {
  mealType?: MealType | string;
  mealName?: string;
  timeSlot?: string;
  totalCalories?: number | string;
  foods?: DietPlanFoodPayload[];
};

type DietPlanGuidelinePayload = {
  category?: string;
  note?: string;
};

type DietPlanPayload = {
  bmr?: number | string;
  tdee?: number | string;
  dailyCalorieTarget?: number | string;
  proteinG?: number | string;
  carbsG?: number | string;
  fatsG?: number | string;
  meals?: DietPlanMealPayload[];
  guidelines?: DietPlanGuidelinePayload[];
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeMealType(value: unknown): MealType {
  if (
    typeof value === "string" &&
    Object.values(MealType).includes(value as MealType)
  ) {
    return value as MealType;
  }
  return MealType.BREAKFAST;
}

function normalizeNumberOrString(value: unknown): number | string | undefined {
  return typeof value === "number" || typeof value === "string"
    ? value
    : undefined;
}

function normalizeString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function normalizeDietPlanPayload(plan: unknown): DietPlanPayload {
  if (!isObject(plan)) {
    return {};
  }

  const rawPlan = isObject(plan) && "dietPlan" in plan ? plan.dietPlan : plan;
  if (!isObject(rawPlan)) {
    return {};
  }

  const rawPlanObj = rawPlan as Record<string, unknown>;
  const calculations =
    isObject(rawPlanObj.calculations) && rawPlanObj.calculations
      ? (rawPlanObj.calculations as Record<string, unknown>)
      : undefined;
  const macros =
    calculations && isObject(calculations.macros)
      ? (calculations.macros as Record<string, unknown>)
      : undefined;

  const meals = Array.isArray(rawPlanObj.meals)
    ? rawPlanObj.meals.filter(isObject).map((item) => ({
        mealType: normalizeMealType(item.mealType),
        mealName: normalizeString(item.mealName),
        timeSlot: normalizeString(item.timeSlot),
        totalCalories: normalizeNumberOrString(item.totalCalories),
        foods: Array.isArray(item.foods)
          ? item.foods.filter(isObject).map((food) => ({
              name: normalizeString(food.name),
              quantity: normalizeNumberOrString(food.quantity),
              unit: normalizeString(food.unit),
              proteinG: normalizeNumberOrString(food.proteinG),
              calories: normalizeNumberOrString(food.calories),
            }))
          : undefined,
      }))
    : undefined;

  const guidelines = Array.isArray(rawPlanObj.guidelines)
    ? rawPlanObj.guidelines.filter(isObject).map((item) => ({
        category: normalizeString(item.category),
        note: normalizeString(item.note),
      }))
    : undefined;

  return {
    bmr:
      normalizeNumberOrString(rawPlanObj.bmr) ??
      normalizeNumberOrString(calculations?.bmr),
    tdee:
      normalizeNumberOrString(rawPlanObj.tdee) ??
      normalizeNumberOrString(calculations?.tdee),
    dailyCalorieTarget:
      normalizeNumberOrString(rawPlanObj.dailyCalorieTarget) ??
      normalizeNumberOrString(calculations?.dailyCalorieTarget),
    proteinG:
      normalizeNumberOrString(rawPlanObj.proteinG) ??
      normalizeNumberOrString(macros?.proteinG),
    carbsG:
      normalizeNumberOrString(rawPlanObj.carbsG) ??
      normalizeNumberOrString(macros?.carbsG),
    fatsG:
      normalizeNumberOrString(rawPlanObj.fatsG) ??
      normalizeNumberOrString(macros?.fatsG),
    meals,
    guidelines,
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dietPlan = await prisma.dietPlan.findFirst({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
      include: {
        meals: {
          include: {
            foods: true,
          },
        },
        guidelines: true,
      },
    });

    return NextResponse.json({ dietPlan });
  } catch (error) {
    console.error("Error fetching diet plan:", error);
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

    const body = (await request.json()) as { plan?: unknown };
    let plan = body.plan;

    if (!plan) {
      return NextResponse.json(
        { error: "Missing plan payload" },
        { status: 400 },
      );
    }

    if (typeof plan === "string") {
      try {
        plan = JSON.parse(plan.replace(/```json|```/g, "").trim());
      } catch (parseError) {
        console.error("Failed to parse diet plan string", parseError);
        return NextResponse.json(
          { error: "Invalid diet plan format" },
          { status: 400 },
        );
      }
    }

    const normalizedPlan = normalizeDietPlanPayload(plan);

    await prisma.dietPlan.deleteMany({
      where: { userId: session.user.id, isActive: true },
    });

    const createdPlan = await prisma.dietPlan.create({
      data: {
        userId: session.user.id,
        bmr: Number(normalizedPlan.bmr ?? 0),
        tdee: Number(normalizedPlan.tdee ?? 0),
        dailyCalorieTarget: Number(normalizedPlan.dailyCalorieTarget ?? 0),
        proteinG: Number(normalizedPlan.proteinG ?? 0),
        carbsG: Number(normalizedPlan.carbsG ?? 0),
        fatsG: Number(normalizedPlan.fatsG ?? 0),
        meals: {
          create: Array.isArray(normalizedPlan.meals)
            ? normalizedPlan.meals.map((meal) => ({
                mealType: normalizeMealType(meal.mealType),
                mealName: meal.mealName ?? "Meal",
                timeSlot: meal.timeSlot ?? "",
                totalCalories: Number(meal.totalCalories ?? 0),
                foods: {
                  create: Array.isArray(meal.foods)
                    ? meal.foods.map((food) => ({
                        name: food.name ?? "",
                        quantity: Number(food.quantity ?? 0),
                        unit: food.unit ?? "",
                        proteinG: Number(food.proteinG ?? 0),
                        calories: Number(food.calories ?? 0),
                      }))
                    : [],
                },
              }))
            : [],
        },
        guidelines: {
          create: Array.isArray(normalizedPlan.guidelines)
            ? normalizedPlan.guidelines.map((guideline) => ({
                category: guideline.category ?? "General",
                note: guideline.note ?? "",
              }))
            : [],
        },
      },
      include: {
        meals: {
          include: {
            foods: true,
          },
        },
        guidelines: true,
      },
    });
    console.log("Created diet plan:", createdPlan);

    return NextResponse.json({ dietPlan: createdPlan });
  } catch (error) {
    console.error("Error saving diet plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
