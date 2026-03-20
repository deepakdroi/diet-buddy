import type {
  UserMetrics,
  UserActivityLevel,
  UserDietaryPreferences,
  UserGoals,
} from "@prisma/client";
import { apiFetch } from "./api-client";

export const getUserMetrics = () =>
  apiFetch<{ metrics: UserMetrics | null }>(`/api/user/metrics`, {
    method: "GET",
    cache: "no-store",
  });

export const saveUserMetrics = (data: Partial<UserMetrics>) =>
  apiFetch<{ metrics: UserMetrics }>(`/api/user/metrics`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getUserActivityLevel = () =>
  apiFetch<{ activityLevel: UserActivityLevel | null }>(
    `/api/user/activity-level`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

export const saveUserActivityLevel = (data: Partial<UserActivityLevel>) =>
  apiFetch<{ activityLevel: UserActivityLevel }>(`/api/user/activity-level`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getUserDietaryPreferences = () =>
  apiFetch<{ prefs: UserDietaryPreferences | null }>(
    `/api/user/dietary-preferences`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

export const saveUserDietaryPreferences = (
  data: Partial<UserDietaryPreferences>,
) =>
  apiFetch<{ prefs: UserDietaryPreferences }>(`/api/user/dietary-preferences`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getUserGoals = () =>
  apiFetch<{ goals: UserGoals | null }>(`/api/user/goals`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

export const saveUserGoals = (data: Partial<UserGoals>) =>
  apiFetch<{ goals: UserGoals }>(`/api/user/goals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
