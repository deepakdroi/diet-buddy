export type UserData = {
  metrics: {
    age: number;
    gender: string;
    height: number;
    weight: number;
    bodyFatPercentage?: number | null;
  };
  activity: {
    dailyActivityLevel: string;
    exerciseFrequency: string;
  };
  goals: {
    primaryGoal: string;
    targetWeight?: number | null;
    timeline: string;
    timelineDays?: number | null;
    urgencyPreference: string;
  };
  diet: {
    dietType: string;
    mealsPerDay: string;
    budgetPreference: string;
  };
};
