"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ProfileModals, {
  type ProfileModalType,
} from "@/components/profile/ProfileModals";
import { metricsSchema, type MetricsForm } from "@/schemas/user.schema";
import { activitySchema, type ActivityForm } from "@/schemas/activity.schema";
import { dietSchema, type DietForm } from "@/schemas/diet.schema";
import { goalsSchema, type GoalsForm } from "@/schemas/goal.schema";
import { type Goals } from "@/types/goal.types";
import { type Metrics } from "@/types/user.types";
import { type Activity } from "@/types/activity.types";
import { type Diet } from "@/types/diet.types";
import {
  Gender,
  DailyActivityLevel,
  ExerciseFrequency,
  WorkoutDuration,
  DietType,
  MealsPerDay,
  CookingTimePreference,
  BudgetPreference,
  PrimaryGoal,
  Timeline,
  UrgencyPreference,
} from "@prisma/client";
import {
  getUserMetrics,
  saveUserMetrics,
  getUserActivityLevel,
  saveUserActivityLevel,
  getUserDietaryPreferences,
  saveUserDietaryPreferences,
  getUserGoals,
  saveUserGoals,
  getLatestDietPlan,
  type DietPlanWithRelations,
} from "@/lib/profileHelpers";

export default function ProfilePage() {
  const router = useRouter();
  const session = authClient.useSession();
  const { toast } = useToast();

  // --- hooks for state (always called regardless of session) ---
  const [metrics, setMetrics] = React.useState<Metrics | null>(null);
  const [activity, setActivity] = React.useState<Activity | null>(null);
  const [dietary, setDietary] = React.useState<Diet | null>(null);
  const [goals, setGoals] = React.useState<Goals | null>(null);
  const [dietPlan, setDietPlan] = React.useState<DietPlanWithRelations | null>(
    null,
  );

  const [modalType, setModalType] = React.useState<ProfileModalType | null>(
    null,
  );

  // React Hook Form hooks
  const metricsForm = useForm<MetricsForm>({
    resolver: zodResolver(metricsSchema),
    defaultValues: {
      age: undefined,
      gender: undefined,
      height: undefined,
      weight: undefined,
      bodyFatPercentage: undefined,
    },
  });

  const activityForm = useForm<ActivityForm>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      dailyActivityLevel: undefined,
      exerciseFrequency: undefined,
      exerciseTypes: [],
      averageWorkoutDuration: undefined,
    },
  });

  const dietForm = useForm<DietForm>({
    resolver: zodResolver(dietSchema),
    defaultValues: {
      dietType: undefined,
      mealsPerDay: undefined,
      cookingTimePreference: undefined,
      budgetPreference: undefined,
    },
  });

  const goalsForm = useForm<GoalsForm>({
    resolver: zodResolver(goalsSchema),
    defaultValues: {
      primaryGoal: undefined,
      targetWeight: undefined,
      timeline: undefined,
      timelineDays: undefined,
      urgencyPreference: undefined,
    },
  });

  useEffect(() => {
    // Redirect to signin if not authenticated
    if (session.data === null) {
      router.push("/signin");
    }
  }, [session.data, router]);

  useEffect(() => {
    // fetch profile-related data
    async function load() {
      try {
        const [mRes, aRes, dRes, gRes, planRes] = await Promise.all([
          getUserMetrics(),
          getUserActivityLevel(),
          getUserDietaryPreferences(),
          getUserGoals(),
          getLatestDietPlan(),
        ]);
        if (mRes.metrics) setMetrics(mRes.metrics);
        if (aRes.activityLevel) setActivity(aRes.activityLevel);
        if (dRes.prefs) setDietary(dRes.prefs);
        if (gRes.goals) setGoals(gRes.goals);
        if (planRes.dietPlan) setDietPlan(planRes.dietPlan);
      } catch (err) {
        console.error("Error loading profile data", err);
      }
    }
    load();
  }, []);

  if (!session.data) {
    return null;
  }

  const user = session.data.user;

  const openModal = (type: ProfileModalType) => {
    setModalType(type);
    // prefill form if existing
    switch (type) {
      case "metrics":
        const transformedMetrics = metrics
          ? {
              ...metrics,
              bodyFatPercentage: metrics.bodyFatPercentage ?? undefined,
            }
          : {};
        metricsForm.reset(transformedMetrics);
        break;
      case "activity":
        activityForm.reset(activity || {});
        break;
      case "diet":
        dietForm.reset(dietary || {});
        break;
      case "goals":
        goalsForm.reset(
          goals
            ? {
                primaryGoal: goals.primaryGoal,
                timeline: goals.timeline,
                urgencyPreference: goals.urgencyPreference,
                targetWeight: goals.targetWeight ?? undefined,
                timelineDays: goals.timelineDays ?? undefined,
              }
            : {},
        );
        break;
    }
  };

  const closeModal = () => {
    setModalType(null);
    metricsForm.reset();
    activityForm.reset();
    dietForm.reset();
    goalsForm.reset();
  };

  const onSubmitMetrics = async (data: MetricsForm) => {
    try {
      await saveUserMetrics({
        ...data,
        gender: data.gender as Gender,
        bodyFatPercentage: data.bodyFatPercentage ?? null,
      });
      toast({
        title: "Body Stats Updated",
        description: "Your body stats have been saved successfully.",
        variant: "success",
      });
      const mRes = await getUserMetrics();
      setMetrics(mRes.metrics);
      closeModal();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error Saving Data",
        description:
          "There was an error saving your body stats. Please try again.",
        variant: "error",
      });
    }
  };

  const onSubmitActivity = async (data: ActivityForm) => {
    try {
      await saveUserActivityLevel({
        ...data,
        dailyActivityLevel: data.dailyActivityLevel as DailyActivityLevel,
        exerciseFrequency: data.exerciseFrequency as ExerciseFrequency,
        averageWorkoutDuration: data.averageWorkoutDuration as WorkoutDuration,
      });
      toast({
        title: "Daily Activity Updated",
        description: "Your daily activity has been saved successfully.",
        variant: "success",
      });
      const aRes = await getUserActivityLevel();
      setActivity(aRes.activityLevel);
      closeModal();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error Saving Data",
        description:
          "There was an error saving your daily activity. Please try again.",
        variant: "error",
      });
    }
  };

  const onSubmitDiet = async (data: DietForm) => {
    try {
      await saveUserDietaryPreferences({
        ...data,
        dietType: data.dietType as DietType,
        mealsPerDay: data.mealsPerDay as MealsPerDay,
        cookingTimePreference:
          data.cookingTimePreference as CookingTimePreference,
        budgetPreference: data.budgetPreference as BudgetPreference,
      });
      toast({
        title: "Food Preferences Updated",
        description: "Your food preferences have been saved successfully.",
        variant: "success",
      });
      const dRes = await getUserDietaryPreferences();
      setDietary(dRes.prefs);
      closeModal();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error Saving Data",
        description:
          "There was an error saving your food preferences. Please try again.",
        variant: "error",
      });
    }
  };

  const onSubmitGoals = async (data: GoalsForm) => {
    try {
      const normalizedGoals = {
        ...data,
        primaryGoal: data.primaryGoal as PrimaryGoal,
        timeline: data.timeline as Timeline,
        urgencyPreference: data.urgencyPreference as UrgencyPreference,
        targetWeight: data.targetWeight ?? null,
        timelineDays:
          data.timeline === "CUSTOM"
            ? (data.timelineDays ?? undefined)
            : undefined,
      };

      await saveUserGoals(normalizedGoals);

      toast({
        title: "Goals Updated",
        description: "Your goals have been saved successfully.",
        variant: "success",
      });

      const gRes = await getUserGoals();
      setGoals(gRes.goals);

      if (metrics && activity && dietary && gRes.goals) {
        const payload = {
          metrics,
          activity,
          goals: gRes.goals,
          diet: dietary,
        };

        console.log("📤 Sending to AI:", payload);

        const res = await fetch("/api/diet/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await res.json();
        console.log("🔥 AI RESPONSE:", result.plan);

        if (result?.plan) {
          const saveRes = await fetch("/api/user/diet-plan", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ plan: result.plan }),
          });

          const saveResult = await saveRes.json();

          if (!saveRes.ok) {
            throw new Error(saveResult.error || "Failed to save diet plan");
          }

          setDietPlan(saveResult.dietPlan);
          toast({
            title: "Diet Plan Generated",
            description: "Your AI diet plan was saved successfully.",
            variant: "success",
          });
        } else {
          toast({
            title: "Diet Plan Missing",
            description: "AI did not return a valid diet plan.",
            variant: "error",
          });
        }
      } else {
        toast({
          title: "AI Diet Plan Skipped",
          description:
            "Please complete your profile details before generating a diet plan.",
          variant: "error",
        });
      }

      closeModal();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error Saving Goals",
        description: "There was an error saving your goals.",
        variant: "error",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome, {user.name || user.email}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your profile information below.
          </p>
          <div className="mt-4">
            <Button variant="outline" onClick={() => openModal("dietPlan")}>
              View Diet Plan
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Profile Information
            </h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  Email
                </p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </p>
                <p>{user.name || "Not set"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  Member Since
                </p>
                <p>{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Your Goals
              </h2>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => openModal("goals")}
              >
                {goals ? "Update" : "Add"}
              </Button>
            </section>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Your Body Stats
              </h2>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => openModal("metrics")}
              >
                {metrics ? "Update" : "Add"}
              </Button>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Daily Activity
              </h2>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => openModal("activity")}
              >
                {activity ? "Update" : "Add"}
              </Button>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Food Preferences
              </h2>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => openModal("diet")}
              >
                {dietary ? "Update" : "Add"}
              </Button>
            </section>
          </div>
        </div>

        <ProfileModals
          modalType={modalType}
          onClose={closeModal}
          metricsForm={metricsForm}
          activityForm={activityForm}
          dietForm={dietForm}
          goalsForm={goalsForm}
          dietPlan={dietPlan}
          onSubmitMetrics={onSubmitMetrics}
          onSubmitActivity={onSubmitActivity}
          onSubmitDiet={onSubmitDiet}
          onSubmitGoals={onSubmitGoals}
        />
      </div>
    </div>
  );
}
