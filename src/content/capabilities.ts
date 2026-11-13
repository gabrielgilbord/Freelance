/**
 * Capacidades técnicas organizadas como las capas de un sistema real.
 * Se presentan como un solo stack para comunicar el valor diferencial:
 * una misma persona responde de todas las capas.
 */
export type Capability = { name: string; label: string; text: string };
export type Layer = { key: string; name: string; caption: string; items: Capability[] };

export const layers: Layer[] = [
  {
    key: "interface",
    name: "Interfaz",
    caption: "Lo que usan las personas",
    items: [
      { name: "Frontend", label: "Web", text: "Interfaces rápidas, accesibles y claras, en cualquier navegador." },
      { name: "Mobile", label: "iOS · Android", text: "Apps nativas o multiplataforma para clientes y equipos de campo." },
    ],
  },
  {
    key: "logic",
    name: "Lógica",
    caption: "Lo que hace funcionar el negocio",
    items: [
      { name: "Backend", label: "Servicios", text: "Reglas de negocio, usuarios, permisos y procesos fiables." },
      { name: "APIs", label: "Contratos", text: "Interfaces claras para que tus sistemas y los de terceros se entiendan." },
      { name: "Automation", label: "Flujos", text: "Tareas que se ejecutan solas, con registro y alertas." },
    ],
  },
  {
    key: "intelligence",
    name: "Inteligencia",
    caption: "Lo que interpreta y decide",
    items: [
      { name: "AI", label: "LLMs · Agentes", text: "Modelos que leen, extraen, responden y actúan sobre tus datos." },
    ],
  },
  {
    key: "data",
    name: "Datos e infraestructura",
    caption: "Lo que guarda y sostiene",
    items: [
      { name: "Databases", label: "Modelado", text: "Datos bien estructurados: la base de cualquier sistema que dure." },
      { name: "Cloud", label: "Operación", text: "Despliegue, escalado, monitorización y costes bajo control." },
    ],
  },
  {
    key: "physical",
    name: "Mundo físico",
    caption: "Lo que mide y actúa",
    items: [
      { name: "IoT", label: "Conectividad", text: "Dispositivos que envían datos y reciben órdenes de forma segura." },
      { name: "Hardware", label: "Sensores · Firmware", text: "Integración de sensores, microcontroladores y maquinaria." },
    ],
  },
];
