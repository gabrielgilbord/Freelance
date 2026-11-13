import { toPlainText } from "./format";
import type { ContactDelivery } from "./types";

/** Desarrollo local: imprime el mensaje en la consola del servidor. */
export const consoleDelivery: ContactDelivery = {
  name: "console",
  async send(message) {
    console.info(`\n──── [contacto] ────\n${toPlainText(message)}\n────────────────────\n`);
  },
};
