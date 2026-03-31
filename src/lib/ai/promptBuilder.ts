import { UserData } from "./types";

export function buildDietPrompt(userData: UserData) {
  const { metrics, activity, goals, diet } = userData;

  const systemPrompt = `
You are an expert Indian dietician and nutritionist with 20+ years of experience.
You specialize in creating practical, culturally appropriate Indian meal plans.

STRICT RULES:
1. Respond ONLY with a valid JSON object — no explanation, no markdown, no <think> tags, no text before or after the JSON.
2. Use ONLY Indian foods and ingredients.
3. All nutritional values must be realistic and accurate.
4. Meal count must exactly match the user's mealsPerDay.
5. Total meal calories must sum up to dailyCalorieTarget (±50 kcal tolerance).
6. Protein sources must suit the user's dietType (e.g. no meat for vegetarians).
7. mealType must be one of: BREAKFAST, MID_MORNING_SNACK, LUNCH, EVENING_SNACK, DINNER, POST_WORKOUT.
8. unit must be one of: g, ml, cup, pieces, scoop, tbsp, tsp, bowl.
9. guideline category must be one of: hydration, sleep, general, food_timing, exercise.
`;

  const userPrompt = `
Create a personalized Indian diet plan for this user:

=== USER PROFILE ===
Age: ${metrics.age} years
Gender: ${metrics.gender}
Height: ${metrics.height} cm
Weight: ${metrics.weight} kg
Body Fat: ${metrics.bodyFatPercentage ?? "Not provided"}%

=== ACTIVITY ===
Daily Activity Level: ${activity.dailyActivityLevel}
Exercise Frequency: ${activity.exerciseFrequency}
Exercise Types: ${activity.exerciseTypes.join(", ") || "Not specified"}
Avg Workout Duration: ${activity.averageWorkoutDuration}

=== GOALS ===
Primary Goal: ${goals.primaryGoal}
Target Weight: ${goals.targetWeight ?? "Not specified"} kg
Timeline: ${goals.timeline}
Urgency: ${goals.urgencyPreference}

=== DIETARY PREFERENCES ===
Diet Type: ${diet.dietType}
Meals Per Day: ${diet.mealsPerDay}
Cooking Time Preference: ${diet.cookingTimePreference}
Budget: ${diet.budgetPreference}

=== REQUIRED JSON STRUCTURE ===
{
  "dietPlan": {
    "calculations": {
      "bmr": number,
      "tdee": number,
      "activityMultiplier": number,
      "caloricDeficit": number,
      "dailyCalorieTarget": number,
      "weeklyWeightLossKg": number
    },
    "macros": {
      "dailyCalories": number,
      "proteinG": number,
      "proteinPercent": number,
      "carbsG": number,
      "carbsPercent": number,
      "fatsG": number,
      "fatsPercent": number
    },
    "meals": [
      {
        "mealType": string,
        "mealName": string,
        "timeSlot": string,
        "order": number,
        "totalCalories": number,
        "totalProteinG": number,
        "totalCarbsG": number,
        "totalFatsG": number,
        "foods": [
          {
            "name": string,
            "quantity": number,
            "unit": string,
            "preparation": string | null,
            "calories": number,
            "proteinG": number,
            "carbsG": number,
            "fatsG": number
          }
        ]
      }
    ],
    "guidelines": [
      {
        "category": string,
        "note": string,
        "order": number
      }
    ]
  }
}
`;

  return { systemPrompt, userPrompt };
}
