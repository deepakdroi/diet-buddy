"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/Modal";
import {
  getUserMetrics,
  saveUserMetrics,
  getUserActivityLevel,
  saveUserActivityLevel,
  getUserDietaryPreferences,
  saveUserDietaryPreferences,
} from "@/lib/profileHelpers";

export default function ProfilePage() {
  const router = useRouter();
  const session = authClient.useSession();

  // --- hooks for state (always called regardless of session) ---
  type Metrics = import("@prisma/client").UserMetrics;
  type Activity = import("@prisma/client").UserActivityLevel;
  type Diet = import("@prisma/client").UserDietaryPreferences;

  const [metrics, setMetrics] = React.useState<Metrics | null>(null);
  const [activity, setActivity] = React.useState<Activity | null>(null);
  const [dietary, setDietary] = React.useState<Diet | null>(null);

  const [modalType, setModalType] = React.useState<
    "metrics" | "activity" | "diet" | null
  >(null);

  // combined form data type covering all three models
  type FormData = Partial<Metrics> & Partial<Activity> & Partial<Diet>;
  const [formData, setFormData] = React.useState<FormData>({});

  useEffect(() => {
    // Redirect to signin if not authenticated
    if (session.data === null) {
      router.push("/signin");
    }
  }, [session.data, router]);

  useEffect(() => {
    // fetch profile-related data
    async function load() {
      const [mRes, aRes, dRes] = await Promise.all([
        getUserMetrics(),
        getUserActivityLevel(),
        getUserDietaryPreferences(),
      ]);
      if (mRes.metrics) setMetrics(mRes.metrics);
      if (aRes.activityLevel) setActivity(aRes.activityLevel);
      if (dRes.prefs) setDietary(dRes.prefs);
    }
    load();
  }, []);

  if (!session.data) {
    return null;
  }

  const user = session.data.user;

  const openModal = (type: "metrics" | "activity" | "diet") => {
    setModalType(type);
    // prefill formData if existing
    switch (type) {
      case "metrics":
        // cast to FormData because Partial<Metrics> may not satisfy FormData directly
        setFormData((metrics || {}) as FormData);
        break;
      case "activity":
        setFormData((activity || {}) as FormData);
        break;
      case "diet":
        setFormData((dietary || {}) as FormData);
        break;
    }
  };

  const closeModal = () => {
    setModalType(null);
    setFormData({});
  };

  const handleSubmit = async () => {
    try {
      if (modalType === "metrics") {
        await saveUserMetrics(formData);
        alert("Successfully updated");
        const mRes = await getUserMetrics();
        setMetrics(mRes.metrics);
      } else if (modalType === "activity") {
        await saveUserActivityLevel(formData);
        alert("Successfully updated");
        const aRes = await getUserActivityLevel();
        setActivity(aRes.activityLevel);
      } else if (modalType === "diet") {
        await saveUserDietaryPreferences(formData);
        alert("Successfully updated");
        const dRes = await getUserDietaryPreferences();
        setDietary(dRes.prefs);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving data");
    }
    closeModal();
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
          </div>

          {/* data sections card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
            {/* Body Info Card */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Your Body Info
              </h2>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => openModal("metrics")}
              >
                {metrics ? "Update" : "Add"}
              </Button>
            </section>

            {/* Activity Level Card */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Lifestyle Activity
              </h2>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => openModal("activity")}
              >
                {activity ? "Update" : "Add"}
              </Button>
            </section>

            {/* Dietary Preferences Card */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Diet Preferences
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

        {/* modals for forms */}
        <Modal
          isOpen={!!modalType}
          onClose={closeModal}
          title={
            modalType === "metrics"
              ? "Body Information"
              : modalType === "activity"
                ? "Activity Level"
                : "Dietary Preferences"
          }
        >
          {modalType === "metrics" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-4"
            >
              <div>
                <Label className="block text-sm font-medium">Age</Label>
                <Input
                  type="number"
                  value={formData.age || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, age: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label className="block text-sm font-medium">Gender</Label>
                <select
                  className="mt-1 block w-full"
                  value={formData.gender || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gender: e.target.value as Metrics["gender"],
                    })
                  }
                >
                  <option value="">-- select --</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <Label className="block text-sm font-medium">Height (cm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.height || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      height: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label className="block text-sm font-medium">Weight (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.weight || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weight: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label className="block text-sm font-medium">
                  Body Fat % (optional)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.bodyFatPercentage || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bodyFatPercentage: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save</Button>
              </div>
            </form>
          )}

          {modalType === "activity" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-4"
            >
              <div>
                <Label className="block text-sm font-medium">
                  Daily Activity Level
                </Label>
                <select
                  className="mt-1 block w-full"
                  value={formData.dailyActivityLevel || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dailyActivityLevel: e.target
                        .value as Activity["dailyActivityLevel"],
                    })
                  }
                >
                  <option value="">-- select --</option>
                  <option value="SEDENTARY">Sedentary</option>
                  <option value="LIGHTLY_ACTIVE">Lightly active</option>
                  <option value="MODERATELY_ACTIVE">Moderately active</option>
                  <option value="VERY_ACTIVE">Very active</option>
                  <option value="EXTREMELY_ACTIVE">Extremely active</option>
                </select>
              </div>
              <div>
                <Label className="block text-sm font-medium">
                  Exercise Frequency
                </Label>
                <select
                  className="mt-1 block w-full"
                  value={formData.exerciseFrequency || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      exerciseFrequency: e.target
                        .value as Activity["exerciseFrequency"],
                    })
                  }
                >
                  <option value="">-- select --</option>
                  <option value="NONE">None</option>
                  <option value="ONE_TWO">1-2 days/week</option>
                  <option value="THREE_FOUR">3-4 days/week</option>
                  <option value="FIVE_SIX">5-6 days/week</option>
                  <option value="DAILY">Daily</option>
                </select>
              </div>
              <div>
                <Label className="block text-sm font-medium">
                  Exercise Types (comma separated)
                </Label>
                <Input
                  type="text"
                  value={formData.exerciseTypes?.join(",") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      exerciseTypes: e.target.value
                        .split(",")
                        .map((s) => s.trim()),
                    })
                  }
                />
              </div>
              <div>
                <Label className="block text-sm font-medium">
                  Average Workout Duration
                </Label>
                <select
                  className="mt-1 block w-full"
                  value={formData.averageWorkoutDuration || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      averageWorkoutDuration: e.target
                        .value as Activity["averageWorkoutDuration"],
                    })
                  }
                >
                  <option value="">-- select --</option>
                  <option value="TWENTY_THIRTY">20–30 min</option>
                  <option value="THIRTY_FORTY_FIVE">30–45 min</option>
                  <option value="FORTY_FIVE_SIXTY">45–60 min</option>
                  <option value="SIXTY_NINETY">60–90 min</option>
                  <option value="NINETY_PLUS">90+ min</option>
                </select>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save</Button>
              </div>
            </form>
          )}

          {modalType === "diet" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-4"
            >
              <div>
                <Label className="block text-sm font-medium">Diet Type</Label>
                <select
                  className="mt-1 block w-full"
                  value={formData.dietType || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dietType: e.target.value as Diet["dietType"],
                    })
                  }
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
              </div>
              <div>
                <Label className="block text-sm font-medium">
                  Meals Per Day
                </Label>
                <select
                  className="mt-1 block w-full"
                  value={formData.mealsPerDay || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mealsPerDay: e.target.value as Diet["mealsPerDay"],
                    })
                  }
                >
                  <option value="">-- select --</option>
                  <option value="TWO_MEALS">2 meals</option>
                  <option value="THREE_MEALS">3 meals</option>
                  <option value="FOUR_MEALS">4 meals</option>
                  <option value="FIVE_PLUS_MEALS">5+ meals</option>
                </select>
              </div>
              <div>
                <Label className="block text-sm font-medium">
                  Cooking Time Preference
                </Label>
                <select
                  className="mt-1 block w-full"
                  value={formData.cookingTimePreference || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cookingTimePreference: e.target
                        .value as Diet["cookingTimePreference"],
                    })
                  }
                >
                  <option value="">-- select --</option>
                  <option value="UNDER_15_MINUTES">Under 15 minutes</option>
                  <option value="THIRTY_MINUTES">30 minutes</option>
                  <option value="ONE_HOUR">1 hour</option>
                  <option value="DONT_MIND">Don&apos;t mind</option>
                </select>
              </div>
              <div>
                <Label className="block text-sm font-medium">
                  Budget Preference
                </Label>
                <select
                  className="mt-1 block w-full"
                  value={formData.budgetPreference || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      budgetPreference: e.target
                        .value as Diet["budgetPreference"],
                    })
                  }
                >
                  <option value="">-- select --</option>
                  <option value="BUDGET_FRIENDLY">Budget friendly</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="PREMIUM">Premium</option>
                </select>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save</Button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </div>
  );
}
