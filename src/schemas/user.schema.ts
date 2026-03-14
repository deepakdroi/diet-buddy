import { z } from "zod";

export const metricsSchema = z.object({
  age: z.number().min(1, "Age must be at least 1").max(120, "Age must be at most 120"),
  gender: z.string().refine(val => val && ["MALE", "FEMALE", "OTHER"].includes(val), "Please select a gender"),
  height: z.number().min(50, "Height must be at least 50 cm").max(250, "Height must be at most 250 cm"),
  weight: z.number().min(20, "Weight must be at least 20 kg").max(300, "Weight must be at most 300 kg"),
  bodyFatPercentage: z.number().min(0, "Body fat % must be at least 0").max(50, "Body fat % must be at most 50").optional(),
});

export type MetricsForm = z.infer<typeof metricsSchema>;