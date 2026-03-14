"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/Modal";
import type { UseFormReturn } from "react-hook-form";
import type { MetricsForm } from "@/schemas/user.schema";
import type { ActivityForm } from "@/schemas/activity.schema";
import type { DietForm } from "@/schemas/diet.schema";

export type ProfileModalType = "metrics" | "activity" | "diet";

export type ProfileModalsProps = {
  modalType: ProfileModalType | null;
  onClose: () => void;
  metricsForm: UseFormReturn<MetricsForm>;
  activityForm: UseFormReturn<ActivityForm>;
  dietForm: UseFormReturn<DietForm>;
  onSubmitMetrics: (data: MetricsForm) => void | Promise<void>;
  onSubmitActivity: (data: ActivityForm) => void | Promise<void>;
  onSubmitDiet: (data: DietForm) => void | Promise<void>;
};

export default function ProfileModals({
  modalType,
  onClose,
  metricsForm,
  activityForm,
  dietForm,
  onSubmitMetrics,
  onSubmitActivity,
  onSubmitDiet,
}: ProfileModalsProps) {
  return (
    <Modal
      isOpen={!!modalType}
      onClose={onClose}
      title={
        modalType === "metrics"
          ? "Body Stats"
          : modalType === "activity"
            ? "Daily Activity"
            : "Food Preferences"
      }
    >
      {modalType === "metrics" && (
        <form
          onSubmit={metricsForm.handleSubmit(onSubmitMetrics)}
          className="space-y-4"
        >
          <div>
            <Label className="block text-sm font-medium">Age</Label>
            <Input
              type="number"
              {...metricsForm.register("age", { valueAsNumber: true })}
            />
            {metricsForm.formState.errors.age && (
              <p className="text-red-500 text-sm mt-1">
                {metricsForm.formState.errors.age.message}
              </p>
            )}
          </div>
          <div>
            <Label className="block text-sm font-medium">Gender</Label>
            <select
              className="mt-1 block w-full"
              {...metricsForm.register("gender")}
            >
              <option value="">-- select --</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            {metricsForm.formState.errors.gender && (
              <p className="text-red-500 text-sm mt-1">
                {metricsForm.formState.errors.gender.message}
              </p>
            )}
          </div>
          <div>
            <Label className="block text-sm font-medium">Height (cm)</Label>
            <Input
              type="number"
              step="0.1"
              {...metricsForm.register("height", { valueAsNumber: true })}
            />
            {metricsForm.formState.errors.height && (
              <p className="text-red-500 text-sm mt-1">
                {metricsForm.formState.errors.height.message}
              </p>
            )}
          </div>
          <div>
            <Label className="block text-sm font-medium">Weight (kg)</Label>
            <Input
              type="number"
              step="0.1"
              {...metricsForm.register("weight", { valueAsNumber: true })}
            />
            {metricsForm.formState.errors.weight && (
              <p className="text-red-500 text-sm mt-1">
                {metricsForm.formState.errors.weight.message}
              </p>
            )}
          </div>
          <div>
            <Label className="block text-sm font-medium">
              Body Fat % (optional)
            </Label>
            <Input
              type="number"
              step="0.1"
              {...metricsForm.register("bodyFatPercentage", {
                valueAsNumber: true,
              })}
            />
            {metricsForm.formState.errors.bodyFatPercentage && (
              <p className="text-red-500 text-sm mt-1">
                {metricsForm.formState.errors.bodyFatPercentage.message}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="default"
              className="bg-black text-white dark:bg-white dark:text-black"
            >
              Save
            </Button>
          </div>
        </form>
      )}

      {modalType === "activity" && (
        <form
          onSubmit={activityForm.handleSubmit(onSubmitActivity)}
          className="space-y-4"
        >
          <div>
            <Label className="block text-sm font-medium">
              Daily Activity Level
            </Label>
            <select
              className="mt-1 block w-full"
              {...activityForm.register("dailyActivityLevel")}
            >
              <option value="">-- select --</option>
              <option value="SEDENTARY">Sedentary</option>
              <option value="LIGHTLY_ACTIVE">Lightly active</option>
              <option value="MODERATELY_ACTIVE">Moderately active</option>
              <option value="VERY_ACTIVE">Very active</option>
              <option value="EXTREMELY_ACTIVE">Extremely active</option>
            </select>
            {activityForm.formState.errors.dailyActivityLevel && (
              <p className="text-red-500 text-sm mt-1">
                {activityForm.formState.errors.dailyActivityLevel.message}
              </p>
            )}
          </div>
          <div>
            <Label className="block text-sm font-medium">
              Exercise Frequency
            </Label>
            <select
              className="mt-1 block w-full"
              {...activityForm.register("exerciseFrequency")}
            >
              <option value="">-- select --</option>
              <option value="NONE">None</option>
              <option value="ONE_TWO">1-2 days/week</option>
              <option value="THREE_FOUR">3-4 days/week</option>
              <option value="FIVE_SIX">5-6 days/week</option>
              <option value="DAILY">Daily</option>
            </select>
            {activityForm.formState.errors.exerciseFrequency && (
              <p className="text-red-500 text-sm mt-1">
                {activityForm.formState.errors.exerciseFrequency.message}
              </p>
            )}
          </div>
          <div>
            <Label className="block text-sm font-medium">
              Exercise Types (comma separated)
            </Label>
            <Input
              type="text"
              {...activityForm.register("exerciseTypes", {
                setValueAs: (value) => {
                  if (Array.isArray(value)) return value;
                  if (typeof value !== "string") return [];
                  return value
                    .split(",")
                    .map((s: string) => s.trim())
                    .filter(Boolean);
                },
              })}
            />
            {activityForm.formState.errors.exerciseTypes && (
              <p className="text-red-500 text-sm mt-1">
                {activityForm.formState.errors.exerciseTypes.message}
              </p>
            )}
          </div>
          <div>
            <Label className="block text-sm font-medium">
              Average Workout Duration
            </Label>
            <select
              className="mt-1 block w-full"
              {...activityForm.register("averageWorkoutDuration")}
            >
              <option value="">-- select --</option>
              <option value="TWENTY_THIRTY">20–30 min</option>
              <option value="THIRTY_FORTY_FIVE">30–45 min</option>
              <option value="FORTY_FIVE_SIXTY">45–60 min</option>
              <option value="SIXTY_NINETY">60–90 min</option>
              <option value="NINETY_PLUS">90+ min</option>
            </select>
            {activityForm.formState.errors.averageWorkoutDuration && (
              <p className="text-red-500 text-sm mt-1">
                {activityForm.formState.errors.averageWorkoutDuration.message}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="default"
              className="bg-black text-white dark:bg-white dark:text-black"
            >
              Save
            </Button>
          </div>
        </form>
      )}

      {modalType === "diet" && (
        <form
          onSubmit={dietForm.handleSubmit(onSubmitDiet)}
          className="space-y-4"
        >
          <div>
            <Label className="block text-sm font-medium">Diet Type</Label>
            <select
              className="mt-1 block w-full"
              {...dietForm.register("dietType")}
            >
              <option value="">-- select --</option>
              <option value="VEGETARIAN">Vegetarian</option>
              <option value="VEGAN">Vegan</option>
              <option value="EGGETARIAN">Eggetarian</option>
              <option value="NON_VEGETARIAN">Non-vegetarian</option>
              <option value="KETO">Keto</option>
              <option value="LOW_CARB">Low carb</option>
              <option value="NO_PREFERENCE">No preference</option>
            </select>
            {dietForm.formState.errors.dietType && (
              <p className="text-red-500 text-sm mt-1">
                {dietForm.formState.errors.dietType.message}
              </p>
            )}
          </div>
          <div>
            <Label className="block text-sm font-medium">Meals Per Day</Label>
            <select
              className="mt-1 block w-full"
              {...dietForm.register("mealsPerDay")}
            >
              <option value="">-- select --</option>
              <option value="TWO_MEALS">2 meals</option>
              <option value="THREE_MEALS">3 meals</option>
              <option value="FOUR_MEALS">4 meals</option>
              <option value="FIVE_PLUS_MEALS">5+ meals</option>
            </select>
            {dietForm.formState.errors.mealsPerDay && (
              <p className="text-red-500 text-sm mt-1">
                {dietForm.formState.errors.mealsPerDay.message}
              </p>
            )}
          </div>
          <div>
            <Label className="block text-sm font-medium">
              Cooking Time Preference
            </Label>
            <select
              className="mt-1 block w-full"
              {...dietForm.register("cookingTimePreference")}
            >
              <option value="">-- select --</option>
              <option value="UNDER_15_MINUTES">Under 15 minutes</option>
              <option value="THIRTY_MINUTES">30 minutes</option>
              <option value="ONE_HOUR">1 hour</option>
              <option value="DONT_MIND">Don&apos;t mind</option>
            </select>
            {dietForm.formState.errors.cookingTimePreference && (
              <p className="text-red-500 text-sm mt-1">
                {dietForm.formState.errors.cookingTimePreference.message}
              </p>
            )}
          </div>
          <div>
            <Label className="block text-sm font-medium">
              Budget Preference
            </Label>
            <select
              className="mt-1 block w-full"
              {...dietForm.register("budgetPreference")}
            >
              <option value="">-- select --</option>
              <option value="BUDGET_FRIENDLY">Budget friendly</option>
              <option value="MODERATE">Moderate</option>
              <option value="PREMIUM">Premium</option>
            </select>
            {dietForm.formState.errors.budgetPreference && (
              <p className="text-red-500 text-sm mt-1">
                {dietForm.formState.errors.budgetPreference.message}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="default"
              className="bg-black text-white dark:bg-white dark:text-black"
            >
              Save
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
