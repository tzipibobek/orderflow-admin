import { redirect } from "next/navigation";
import { supabaseServer } from "@/modules/shared/lib/supabase/server";
import { isOwner } from "@/modules/shared/lib/authz";
import { isDemo } from "@/modules/shared/config";

export default async function Home() {
  if (isDemo) redirect("/dashboard");

  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isOwner(user?.email)) redirect("/auth/sign-in");

  redirect("/dashboard");
}
