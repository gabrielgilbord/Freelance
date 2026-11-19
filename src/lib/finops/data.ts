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

export type Role = "superadmin" | "admin" | "member";
export interface Member {
  email: string;
  role: Role;
  created_by: string | null;
  created_at: string;
}

export async function getTeam(): Promise<{ members: Member[]; me: Member | null }> {
  const sb = await createClient();
  const [{ data: auth }, { data }] = await Promise.all([
    sb.auth.getUser(),
    sb.from("members").select("email, role, created_by, created_at").order("created_at"),
  ]);
  const members = (data ?? []) as Member[];
  const email = auth.user?.email?.toLowerCase();
  return { members, me: members.find((m) => m.email === email) ?? null };
}
