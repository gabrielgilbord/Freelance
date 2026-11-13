import { site } from "@/content/site";

const pending = "[pendiente de completar]";

/** Datos del titular: si faltan, se marcan de forma explícita en lugar de inventarlos. */
export const owner = {
  name: site.legal.ownerName || pending,
  taxId: site.legal.taxId || pending,
  address: site.legal.address || pending,
  email: site.contact.email || pending,
};
