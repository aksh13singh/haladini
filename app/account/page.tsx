import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { AuthPanel } from "@/components/account/auth-panel";
import { AccountDashboard } from "@/components/account/account-dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Account",
  description: "Sign in or create your Haladini account.",
};

export default async function AccountPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: { full_name: string | null; is_admin: boolean } | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, is_admin")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <div className="container section">
      {user ? (
        <AccountDashboard
          name={
            profile?.full_name ??
            (user.user_metadata?.full_name as string) ??
            user.email?.split("@")[0] ??
            "there"
          }
          email={user.email ?? ""}
          isAdmin={profile?.is_admin ?? false}
          createdAt={user.created_at}
        />
      ) : (
        <AuthPanel />
      )}
    </div>
  );
}
