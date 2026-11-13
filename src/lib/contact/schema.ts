import { z } from "zod";

export const projectTypes = [
  { value: "software", label: "Aplicación web, móvil o escritorio" },
  { value: "ai", label: "Inteligencia artificial" },
  { value: "iot", label: "IoT / dispositivos conectados" },
  { value: "automation", label: "Automatización o integraciones" },
  { value: "product", label: "Producto digital / MVP" },
  { value: "architecture", label: "Arquitectura o auditoría técnica" },
  { value: "unsure", label: "Aún no lo tengo claro" },
] as const;

export const budgets = [
  { value: "", label: "Prefiero no indicarlo" },
  { value: "lt5", label: "Menos de 5.000 €" },
  { value: "5-15", label: "5.000 € – 15.000 €" },
  { value: "15-40", label: "15.000 € – 40.000 €" },
  { value: "gt40", label: "Más de 40.000 €" },
] as const;

const projectTypeValues = projectTypes.map((p) => p.value) as [string, ...string[]];
const budgetValues = budgets.map((b) => b.value) as [string, ...string[]];

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Indica tu nombre.").max(120),
  email: z.email("Revisa el email: no parece válido.").trim().max(200),
  company: z.string().trim().max(160).optional().default(""),
  projectType: z.enum(projectTypeValues, { error: "Elige el tipo de proyecto." }),
  budget: z.enum(budgetValues).optional().default(""),
  message: z
    .string()
    .trim()
    .min(20, "Cuéntame un poco más (mínimo 20 caracteres).")
    .max(5000, "El mensaje es demasiado largo (máximo 5.000 caracteres)."),
  consent: z.literal("on", { error: "Necesito tu consentimiento para responderte." }),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;

export type ContactState =
  | { status: "idle" }
  | { status: "success"; name: string }
  | { status: "error"; message: string; fieldErrors?: ContactFieldErrors; values?: Record<string, string> };

export function labelFor<T extends readonly { value: string; label: string }[]>(list: T, value: string) {
  return list.find((i) => i.value === value)?.label ?? value;
}
