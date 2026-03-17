import { z } from "zod";
import { PrimaryGoal, Timeline, UrgencyPreference } from "@prisma/client";

export const goalsSchema = z
  .object({
    primaryGoal: z.nativeEnum(PrimaryGoal),

    targetWeight: z
      .number()
      .min(20, "Target weight must be at least 20 kg")
      .max(300, "Target weight must be at most 300 kg")
      .optional(),

    timeline: z.nativeEnum(Timeline),

    timelineDays: z
      .number()
      .min(7, "Timeline must be at least 7 days")
      .max(730, "Timeline cannot exceed 2 years")
      .optional(),

    urgencyPreference: z.nativeEnum(UrgencyPreference),
  })
  .refine(
    (data) => data.timeline !== "CUSTOM" || data.timelineDays !== undefined,
    {
      message: "Timeline days required for custom timeline",
      path: ["timelineDays"],
    },
  );

export type GoalsForm = z.infer<typeof goalsSchema>;
