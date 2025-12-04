import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function ProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Check session server-side with actual request headers
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) {
    redirect("/signin");
  }

  return <>{children}</>;
}
