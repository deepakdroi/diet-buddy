import { UserData } from "./types";

export function buildDietPrompt(userData: UserData) {
  const { metrics, activity, goals, diet } = userData;

  return `
You are a professional Indian dietician.

Create a practical Indian diet plan.

USER DATA:
Age: ${metrics.age}
Gender: ${metrics.gender}
Height: ${metrics.height}
Weight: ${metrics.weight}
Body Fat: ${metrics.bodyFatPercentage ?? "N/A"}

Activity: ${activity.dailyActivityLevel}
Exercise: ${activity.exerciseFrequency}

Goal: ${goals.primaryGoal}
Target Weight: ${goals.targetWeight ?? "N/A"}
Timeline: ${goals.timeline}
Urgency: ${goals.urgencyPreference}

Diet:
Type: ${diet.dietType}
Meals: ${diet.mealsPerDay}
Budget: ${diet.budgetPreference}

OUTPUT:
- Calories
- Macros
- Meal plan (Indian foods only)
`;
}
