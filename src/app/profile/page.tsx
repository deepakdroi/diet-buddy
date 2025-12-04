"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const router = useRouter();
  const session = authClient.useSession();

  useEffect(() => {
    // Redirect to signin if not authenticated
    if (session.data === null) {
      router.push("/signin");
    }
  }, [session.data, router]);

  if (!session.data) {
    return null;
  }

  const user = session.data.user;

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

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Actions
            </h2>
            <div className="space-y-2">
              <Button
                onClick={async () => {
                  await authClient.signOut();
                  router.push("/signin");
                }}
                className="w-full bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Account Settings
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            More profile customization options coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
