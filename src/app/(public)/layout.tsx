import verifyAuthentication from "@/utils/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isAuthenticated = await verifyAuthentication();

  if (isAuthenticated) {
    redirect("/home");
  }

  return <div className="h-screen">{children}</div>;
}
