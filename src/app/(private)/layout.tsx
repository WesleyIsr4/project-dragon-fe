export const revalidate = 0;

import verifyAuthentication from "@/utils/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function PrivateLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isAuthenticated = await verifyAuthentication();

  if (!isAuthenticated) return redirect("/");

  return <>{children}</>;
}
