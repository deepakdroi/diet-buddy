import { z } from "zod";

export const dietSchema = z.object({
  dietType: z
    .string()
    .refine(
      (val) =>
        val &&
        [
          "VEGETARIAN",
          "VEGAN",
          "EGGETARIAN",
          "NON_VEGETARIAN",
          "KETO",
          "LOW_CARB",
          "NO_PREFERENCE",
        ].includes(val),
      "Please select diet type",
    ),
  mealsPerDay: z
    .string()
    .refine(
      (val) =>
        val &&
        ["TWO_MEALS", "THREE_MEALS", "FOUR_MEALS", "FIVE_PLUS_MEALS"].includes(
          val,
        ),
      "Please select meals per day",
    ),
  cookingTimePreference: z.string().refine(
    (val) =>
      val &&
      ["UNDER_15_MINUTES", "THIRTY_MINUTES", "ONE_HOUR", "DONT_MIND"].includes(
        val,
      ),
    "Please select cooking time preference", // ✅ was missing entirely
  ),
  budgetPreference: z
    .string()
    .refine(
      (val) => val && ["BUDGET_FRIENDLY", "MODERATE", "PREMIUM"].includes(val),
      "Please select budget preference",
    ),
});

export type DietForm = z.infer<typeof dietSchema>;
