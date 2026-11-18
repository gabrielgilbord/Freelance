import { createClient } from "./supabase/server";
import type { LedgerData } from "./types";

export async function getLedger(): Promise<LedgerData & { isMember: boolean; email: string | null }> {
  const sb = await createClient();
  const [
    { data: auth },
    partners,
    funds,
    projects,
    resources,
    subscriptions,
    movements,
    rules,
    fundMovements,
    members,
  ] = await Promise.all([
    sb.auth.getUser(),
    sb.from("partners").select("*").order("created_at"),
    sb.from("funds").select("*").order("priority").order("created_at"),
    sb.from("projects").select("*").order("name"),
    sb.from("resources").select("*").order("created_at"),
    sb.from("subscriptions").select("*").order("start_date"),
    sb.from("movements").select("*").order("date", { ascending: false }),
    sb.from("distribution_rules").select("*").order("created_at"),
    sb.from("fund_movements").select("*").order("date", { ascending: false }),
    sb.from("members").select("email"),
  ]);
  return {
    email: auth.user?.email ?? null,
    isMember: (members.data?.length ?? 0) > 0,
    partners: partners.data ?? [],
    funds: funds.data ?? [],
    projects: projects.data ?? [],
    resources: resources.data ?? [],
    subscriptions: subscriptions.data ?? [],
    movements: movements.data ?? [],
    rules: rules.data ?? [],
    fundMovements: fundMovements.data ?? [],
  };
}

export async function getMembers(): Promise<string[]> {
  const sb = await createClient();
  const { data } = await sb.from("members").select("email").order("created_at");
  return (data ?? []).map((m) => m.email);
}
