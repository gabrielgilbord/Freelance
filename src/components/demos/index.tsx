import type { ComponentType } from "react";
import { ColdRoomDemo } from "./cold-room-demo";
import { DocsDemo } from "./docs-demo";
import { OrdersDemo } from "./orders-demo";

/** Demo visual de cada caso, por slug. Un proyecto nuevo puede no tener demo. */
export const projectDemos: Record<string, ComponentType<{ className?: string }>> = {
  "telemetria-camaras-frigorificas": ColdRoomDemo,
  "asistente-documentacion-interna": DocsDemo,
  "automatizacion-pedidos-email": OrdersDemo,
};
