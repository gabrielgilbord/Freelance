const eur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", useGrouping: "always" } as Intl.NumberFormatOptions);
const eurRound = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0, useGrouping: "always" } as Intl.NumberFormatOptions);

/** Céntimos → "1.234,56 €" */
export const money = (cents: number) => eur.format(cents / 100);
export const moneyRound = (cents: number) => eurRound.format(Math.round(cents / 100));
/** Euros (de la BD) → "1.234,56 €" */
export const euros = (v: number | string) => eur.format(Number(v));

export function monthLabel(m: string) {
  const [y, mo] = m.split("-").map(Number) as [number, number];
  const name = new Date(Date.UTC(y, mo - 1, 1)).toLocaleDateString("es-ES", { month: "long", timeZone: "UTC" });
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${y}`;
}

export function monthShort(m: string) {
  const [y, mo] = m.split("-").map(Number) as [number, number];
  return new Date(Date.UTC(y, mo - 1, 1)).toLocaleDateString("es-ES", { month: "short", timeZone: "UTC" }).replace(".", "");
}

export function dateLabel(d: string) {
  return new Date(d + "T00:00:00Z").toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export const CATEGORY_LABEL: Record<string, string> = {
  hosting: "Hosting",
  dominio: "Dominio",
  base_datos: "Base de datos",
  api: "API / servicio",
  software: "Software",
  marketing: "Marketing",
  otro: "Otro",
};

export const BILLING_LABEL: Record<string, string> = {
  monthly: "al mes",
  yearly: "al año",
  free: "gratis",
};

export const POLICY_LABEL: Record<string, string> = {
  recurring_first: "Los gastos salen primero de las mensualidades",
  one_off_first: "Los gastos salen primero de los pagos únicos",
  proportional: "Los gastos se reparten en proporción a cada ingreso",
};

export const STREAM_LABEL: Record<string, string> = {
  one_off: "Pagos únicos",
  recurring: "Mensualidades",
};

/** Paleta de datos sobre fondo grafito: tonos de papel, acero y arena. El naranja queda para la marca. */
export const PARTNER_COLORS = ["#ECEAE4", "#93AAB5", "#C9B98F", "#9FD18B", "#B7A3C9", "#D9A0A0"];
export const PROJECT_COLORS = ["#93AAB5", "#C9B98F", "#9FD18B", "#B7A3C9", "#ECEAE4", "#D9A0A0", "#7F8C86"];
export const FUND_COLORS = ["#6E7A73", "#4F6A75", "#8A7F62", "#5D6E52"];
export const COLOR_NAMES: Record<string, string> = {
  "#ECEAE4": "Papel", "#93AAB5": "Acero", "#C9B98F": "Arena", "#9FD18B": "Verde", "#B7A3C9": "Lila", "#D9A0A0": "Rosa",
  "#7F8C86": "Gris", "#6E7A73": "Pizarra", "#4F6A75": "Petróleo", "#8A7F62": "Latón", "#5D6E52": "Oliva",
};
