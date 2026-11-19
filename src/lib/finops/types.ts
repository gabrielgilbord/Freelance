export type Stream = "one_off" | "recurring";
export type ExpensePolicy = "recurring_first" | "one_off_first" | "proportional";

export interface Partner {
  id: string;
  name: string;
  color: string;
  active: boolean;
  email?: string | null;
}

export interface ProjectPartner {
  project_id: string;
  partner_id: string;
}

export interface Fund {
  id: string;
  name: string;
  description: string | null;
  color: string;
  covers_deficits: boolean;
  priority: number;
}

export interface Project {
  id: string;
  name: string;
  client: string | null;
  color: string;
  status: "active" | "paused" | "archived";
  expense_policy: ExpensePolicy;
  notes: string | null;
}

export type ResourceCategory =
  | "hosting"
  | "dominio"
  | "base_datos"
  | "api"
  | "software"
  | "marketing"
  | "otro";

export interface Resource {
  id: string;
  project_id: string;
  name: string;
  provider: string | null;
  category: ResourceCategory;
  cost: number;
  billing: "monthly" | "yearly" | "free";
  start_date: string;
  end_date: string | null;
  url: string | null;
  notes: string | null;
}

export interface Subscription {
  id: string;
  project_id: string;
  client: string;
  description: string | null;
  amount: number; // importe por periodo de facturación
  start_date: string;
  end_date: string | null;
  billing_interval: BillingInterval;
  billing_day: number;
  billing_emails: string | null;
}

export type BillingInterval = "monthly" | "quarterly" | "yearly";
export type InvoiceStatus = "pending" | "processing" | "paid" | "cancelled";

export interface Invoice {
  id: string;
  project_id: string;
  subscription_id: string | null;
  period_date: string | null;
  number: string;
  client: string;
  billing_emails: string | null;
  concept: string;
  amount: number;
  issue_date: string;
  due_date: string | null;
  status: InvoiceStatus;
  paid_date: string | null;
  notes: string | null;
}

export interface Movement {
  id: string;
  project_id: string;
  kind: "income" | "expense";
  amount: number;
  date: string;
  description: string;
  invoice_id?: string | null;
}

export interface Rule {
  id: string;
  project_id: string;
  stream: Stream;
  partner_id: string | null;
  fund_id: string | null;
  percent: number;
}

export interface FundMovement {
  id: string;
  fund_id: string;
  amount: number;
  date: string;
  partner_id: string | null;
  note: string | null;
}

export interface LedgerData {
  partners: Partner[];
  funds: Fund[];
  projects: Project[];
  resources: Resource[];
  subscriptions: Subscription[];
  movements: Movement[];
  rules: Rule[];
  fundMovements: FundMovement[];
  invoices?: Invoice[];
  projectPartners?: ProjectPartner[];
}
