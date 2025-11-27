import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/modules/shared/lib/supabase/server";
import { isOwner } from "@/modules/shared/lib/authz";
import { ToastProvider } from "@/modules/shared/ui/Toast";
import { isDemo } from "@/modules/shared/config";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  if (isDemo) return <ToastProvider>{children}</ToastProvider>;

  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");

  if (!isOwner(user.email)) redirect("/auth/sign-in?err=unauthorized");

  return <ToastProvider>{children}</ToastProvider>;
}
