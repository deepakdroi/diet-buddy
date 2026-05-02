"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/Modal";
import type { UseFormReturn } from "react-hook-form";
import type { MetricsForm } from "@/schemas/user.schema";
import type { ActivityForm } from "@/schemas/activity.schema";
import type { DietForm } from "@/schemas/diet.schema";
import type { GoalsForm } from "@/schemas/goal.schema";
import type { DietPlan, Guideline, Meal, Food } from "@prisma/client";

export type ProfileModalType =
  | "metrics"
  | "activity"
  | "diet"
  | "goals"
  | "dietPlan";

export type DietPlanWithRelations = DietPlan & {
  meals: (Meal & { foods: Food[] })[];
  guidelines: Guideline[];
};

export type ProfileModalsProps = {
  modalType: ProfileModalType | null;
  onClose: () => void;
  metricsForm: UseFormReturn<MetricsForm>;
  activityForm: UseFormReturn<ActivityForm>;
  dietForm: UseFormReturn<DietForm>;
  goalsForm: UseFormReturn<GoalsForm>;
  dietPlan?: DietPlanWithRelations | null;
  onSubmitMetrics: (data: MetricsForm) => void | Promise<void>;
  onSubmitActivity: (data: ActivityForm) => void | Promise<void>;
  onSubmitDiet: (data: DietForm) => void | Promise<void>;
  onSubmitGoals: (data: GoalsForm) => void | Promise<void>;
};

export default function ProfileModals({
  modalType,
  onClose,
  metricsForm,
  activityForm,
  dietForm,
  goalsForm,
  dietPlan,
  onSubmitMetrics,
  onSubmitActivity,
  onSubmitDiet,
  onSubmitGoals,
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
            : modalType === "diet"
              ? "Food Preferences"
              : modalType === "goals"
                ? "Your Goals"
                : "Diet Plan"
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
              <option value="NO_EXERCISE">None</option>
              <option value="ONE_TWO_DAYS">1-2 days/week</option>
              <option value="THREE_FOUR_DAYS">3-4 days/week</option>
              <option value="FIVE_SIX_DAYS">5-6 days/week</option>
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

      {modalType === "dietPlan" && (
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {!dietPlan ? (
            <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
              <p>
                No active diet plan found yet. Save your goals to generate one.
              </p>
              <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <>
              <section className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Plan Summary
                </h2>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      TDEE
                    </p>
                    <p className="mt-2 text-xl font-semibold">
                      {dietPlan.tdee.toFixed(0)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Daily Calories
                    </p>
                    <p className="mt-2 text-xl font-semibold">
                      {dietPlan.dailyCalorieTarget.toFixed(0)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Macros
                    </p>
                    <p className="mt-2 text-sm">
                      P {dietPlan.proteinG.toFixed(0)}g / C{" "}
                      {dietPlan.carbsG.toFixed(0)}g / F{" "}
                      {dietPlan.fatsG.toFixed(0)}g
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Meals
                </h3>
                <div className="space-y-3">
                  {dietPlan.meals.map((meal) => (
                    <details
                      key={meal.id}
                      className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4"
                    >
                      <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-100">
                        <span>{meal.mealName}</span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {meal.timeSlot || "Time not set"}
                        </span>
                      </summary>
                      <div className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                        <p className="font-medium">
                          Total Calories: {meal.totalCalories.toFixed(0)}
                        </p>
                        <div className="space-y-2">
                          {meal.foods.map((food) => (
                            <div
                              key={food.id}
                              className="rounded-xl bg-gray-50 dark:bg-gray-950 p-3"
                            >
                              <div className="flex justify-between gap-4">
                                <p className="font-medium">{food.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {food.quantity}
                                  {food.unit ? ` ${food.unit}` : ""}
                                </p>
                              </div>
                              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Protein: {food.proteinG.toFixed(0)}g · Calories:{" "}
                                {food.calories.toFixed(0)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Guidelines
                </h3>
                <div className="space-y-2">
                  {dietPlan.guidelines.map((guideline) => (
                    <div
                      key={guideline.id}
                      className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-4"
                    >
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {guideline.category}
                      </p>
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                        {guideline.note}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-4 text-sm text-gray-700 dark:text-gray-300">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Tips
                </h3>
                <p className="mt-2">
                  Stay hydrated and aim for 7-8 hours of sleep each night to
                  support recovery and energy.
                </p>
              </section>
            </>
          )}
        </div>
      )}
      {modalType === "goals" && (
        <form
          onSubmit={goalsForm.handleSubmit(onSubmitGoals)}
          className="space-y-4"
        >
          {/* Primary Goal */}
          <div>
            <Label>Primary Goal</Label>
            <select
              className="mt-1 block w-full"
              {...goalsForm.register("primaryGoal")}
            >
              <option value="">-- select --</option>
              <option value="LOSE_FAT">Lose Fat</option>
              <option value="GAIN_MUSCLE">Gain Muscle</option>
              <option value="RECOMPOSITION">Recomposition</option>
              <option value="MAINTAIN_WEIGHT">Maintain Weight</option>
              <option value="IMPROVE_ENDURANCE">Improve Endurance</option>
              <option value="GENERAL_HEALTH">General Health</option>
            </select>
          </div>

          {/* Target Weight */}
          <div>
            <Label>Target Weight (optional)</Label>
            <Input
              type="number"
              step="0.1"
              {...goalsForm.register("targetWeight", {
                valueAsNumber: true,
              })}
            />
          </div>

          {/* Timeline */}
          <div>
            <Label>Timeline</Label>
            <select
              className="mt-1 block w-full"
              {...goalsForm.register("timeline")}
            >
              <option value="">-- select --</option>
              <option value="FOUR_WEEKS">4 weeks</option>
              <option value="EIGHT_WEEKS">8 weeks</option>
              <option value="TWELVE_WEEKS">12 weeks</option>
              <option value="SIXTEEN_PLUS">16+ weeks</option>
              <option value="CUSTOM">Custom</option>
            </select>
          </div>

          {/* Timeline Days (conditional) */}
          {goalsForm.watch("timeline") === "CUSTOM" && (
            <div>
              <Label>Custom Days</Label>
              <Input
                type="number"
                {...goalsForm.register("timelineDays", {
                  valueAsNumber: true,
                })}
              />
            </div>
          )}

          {/* Urgency */}
          <div>
            <Label>Urgency</Label>
            <select
              className="mt-1 block w-full"
              {...goalsForm.register("urgencyPreference")}
            >
              <option value="">-- select --</option>
              <option value="AGGRESSIVE">Aggressive</option>
              <option value="MODERATE">Moderate</option>
              <option value="SUSTAINABLE">Sustainable</option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
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
