import { UserData } from "./types";

export function buildDietPrompt(userData: UserData) {
  const { metrics, activity, goals, diet } = userData;

  const systemPrompt = `
You are a highly experienced Indian Nutritionist and Dietician (20+ years experience).
Your goal is to create a scientifically accurate, culturally relevant Indian meal plan based on specific user data.

STRICT OPERATIONAL RULES:
1. OUTPUT FORMAT: Respond ONLY with a single, valid JSON object. No markdown, no "here is your plan," no conversational text.
2. LANGUAGE: Use common Indian food names (e.g., "Moong Dal Khichdi" instead of "Lentil Porridge").
3. ACCURACY: Nutritional calculations must be realistic for the portion sizes provided.
4. COMPLIANCE: The meal plan MUST strictly follow the user's Diet Type, Budget, and Cooking Time constraints.
5. NO REASONING: Do not include <think> tags or step-by-step logic in the output.
`;

  const userPrompt = `
Generate a comprehensive Indian Diet Plan based on the following profile:

### 1. PHYSICAL METRICS
- Gender: ${metrics.gender}
- Age: ${metrics.age} years
- Height: ${metrics.height} cm | Weight: ${metrics.weight} kg
- Body Fat: ${metrics.bodyFatPercentage ? metrics.bodyFatPercentage + "%" : "Not specified"}

### 2. ACTIVITY & EXERCISE
- Daily Activity Level: ${activity.dailyActivityLevel} (Context: SEDENTARY=desk job, ATHLETE=2+ hrs intense)
- Exercise Frequency: ${activity.exerciseFrequency}
- Typical Workout: ${activity.exerciseTypes.join(", ") || "General movement"}
- Avg Duration: ${activity.averageWorkoutDuration}

### 3. GOALS & TIMELINE
- Primary Goal: ${goals.primaryGoal}
- Target Weight: ${goals.targetWeight ? goals.targetWeight + " kg" : "Maintenance"}
- Timeline: ${goals.timeline}${goals.timelineDays ? ` (${goals.timelineDays} days)` : ""}
- Approach: ${goals.urgencyPreference} (AGGRESSIVE, MODERATE, or SUSTAINABLE)

### 4. DIETARY PREFERENCES
- Diet Type: ${diet.dietType} (STRICTLY follow this: e.g., VEGETARIAN means no meat/eggs, EGGETARIAN includes eggs but no meat)
- Meal Frequency: ${diet.mealsPerDay}
- Cooking Constraint: ${diet.cookingTimePreference}
- Budget Level: ${diet.budgetPreference}

### REQUIRED JSON STRUCTURE
Return the data in this exact structure:
{
  "dietPlan": {
    "calculations": {
      "bmr": number,
      "tdee": number,
      "dailyCalorieTarget": number,
      "macros": { "proteinG": number, "carbsG": number, "fatsG": number }
    },
    "meals": [
      {
        "mealType": "BREAKFAST | LUNCH | EVENING_SNACK | DINNER | etc",
        "mealName": "string",
        "timeSlot": "string",
        "totalCalories": number,
        "foods": [
          { "name": "string", "quantity": number, "unit": "g | ml | cup | pieces", "proteinG": number, "calories": number }
        ]
      }
    ],
    "guidelines": [
      { "category": "hydration | sleep | general", "note": "string" }
    ]
  }
}
`;

  return { systemPrompt, userPrompt };
}
