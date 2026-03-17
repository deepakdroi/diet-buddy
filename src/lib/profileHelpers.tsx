import type {
  UserMetrics,
  UserActivityLevel,
  UserDietaryPreferences,
  UserGoals,
} from "@prisma/client";

export async function getUserMetrics(): Promise<{
  metrics: UserMetrics | null;
}> {
  const res = await fetch(`/api/user/metrics`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return res.json();
}

export async function saveUserMetrics(
  data: Partial<UserMetrics>,
): Promise<{ metrics: UserMetrics }> {
  const res = await fetch(`/api/user/metrics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getUserActivityLevel(): Promise<{
  activityLevel: UserActivityLevel | null;
}> {
  const res = await fetch(`/api/user/activity-level`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return res.json();
}

export async function saveUserActivityLevel(
  data: Partial<UserActivityLevel>,
): Promise<{ activityLevel: UserActivityLevel }> {
  const res = await fetch(`/api/user/activity-level`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getUserDietaryPreferences(): Promise<{
  prefs: UserDietaryPreferences | null;
}> {
  const res = await fetch(`/api/user/dietary-preferences`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return res.json();
}

export async function saveUserDietaryPreferences(
  data: Partial<UserDietaryPreferences>,
): Promise<{ prefs: UserDietaryPreferences }> {
  const res = await fetch(`/api/user/dietary-preferences`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getUserGoals(): Promise<{
  goals: UserGoals | null;
}> {
  const res = await fetch(`/api/user/goals`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  return res.json();
}

export async function saveUserGoals(
  data: Partial<UserGoals>,
): Promise<{ goals: UserGoals }> {
  const res = await fetch(`/api/user/goals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}
