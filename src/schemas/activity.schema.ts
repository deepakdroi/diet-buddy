import { z } from "zod";

export const activitySchema = z.object({
  dailyActivityLevel: z
    .string()
    .refine(
      (val) =>
        val &&
        [
          "SEDENTARY",
          "LIGHTLY_ACTIVE",
          "MODERATELY_ACTIVE",
          "VERY_ACTIVE",
          "ATHLETE",
        ].includes(val),
      "Please select daily activity level",
    ),
  exerciseFrequency: z
    .string()
    .refine(
      (val) =>
        val &&
        [
          "NO_EXERCISE",
          "ONE_TWO_DAYS",
          "THREE_FOUR_DAYS",
          "FIVE_SIX_DAYS",
          "DAILY",
        ].includes(val),
      "Please select exercise frequency",
    ),
  exerciseTypes: z.array(z.string()).optional(),
  averageWorkoutDuration: z
    .string()
    .refine(
      (val) =>
        val &&
        [
          "TWENTY_THIRTY",
          "THIRTY_FORTY_FIVE",
          "FORTY_FIVE_SIXTY",
          "SIXTY_NINETY",
          "NINETY_PLUS",
        ].includes(val),
      "Please select average workout duration",
    ),
});

export type ActivityForm = z.infer<typeof activitySchema>;
