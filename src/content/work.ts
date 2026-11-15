/**
 * Trayectoria y proyectos reales detrás de COTA.
 *
 * Reglas de este archivo (no negociables):
 *  - Solo información confirmada por el autor o verificable en el propio producto
 *    (web pública o repositorio). Nada de métricas, clientes ni funciones supuestas.
 *  - `role` dice qué tipo de participación fue. Una experiencia profesional o una
 *    investigación NUNCA se presentan como trabajo de COTA.
 *  - Lo que falta por confirmar va en `pending`: se ve en local y en preview,
 *    nunca en producción (ver `showDrafts`).
 *
 * Los conceptos y demos técnicas siguen en `projects.ts`, separados de esto.
 */

export type WorkGroup = "producto" | "ingenieria" | "ia";

/** Las seis capas en las que se organiza la experiencia. */
export type LayerKey = "hardware" | "comms" | "industrial" | "cloud" | "product" | "ai";

export type Visual =
  | { kind: "capture"; src: string; alt: string; width: number; height: number; caption: string; second?: { src: string; alt: string; caption: string } }
  | {
      kind: "diagram";
      diagram: DiagramKey;
      caption: string;
      /** Captura real complementaria (p. ej. la web pública), solo en la ficha */
      extra?: { src: string; alt: string; caption: string; width: number; height: number };
    };

export type DiagramKey = "ecg" | "industrial" | "acoustic" | "automation" | "chatbot" | "infra" | "fieldops";

export type Work = {
  slug: string;
  name: string;
  group: WorkGroup;
  /** Qué es, en pocas palabras */
  category: string;
  /** Tipo de participación, tal cual */
  role: string;
  /** Contexto en el que se hizo: propio, universidad, empresa, colaboración */
  setting: string;
  status?: string;
  /** Frase de cabecera: el problema o la oportunidad */
  lead: string;
  context: string;
  built: string[];
  /** Solo tecnologías confirmadas */
  stack: string[];
  proves: string;
  layers: LayerKey[];
  visual: Visual;
  links?: { label: string; href: string }[];
  /** Datos que faltan antes de publicar (solo visibles fuera de producción) */
  pending?: string[];
  /** Peso editorial: 1 = protagonista */
  weight: 1 | 2 | 3;
  /** Aparece a gran tamaño en la home (los productos más maduros) */
  homeFeature?: boolean;
};

export const layerInfo: Record<LayerKey, { name: string; short: string; text: string }> = {
  hardware: {
    name: "Hardware y sistemas embebidos",
    short: "Hardware",
    text: "Placas, sensores y microcontroladores que capturan una señal del mundo físico.",
  },
  comms: {
    name: "Telecomunicaciones e IoT",
    short: "Comunicaciones",
    text: "Cómo viaja el dato: radio de largo alcance, gateways e intercambio seguro entre nodos.",
  },
  industrial: {
    name: "Software de operación y monitorización",
    short: "Operación",
    text: "Supervisar procesos reales: anomalías detectadas a tiempo, datos de producción visibles y trabajo de campo documentado.",
  },
  cloud: {
    name: "Backend, infraestructura y cloud",
    short: "Infraestructura",
    text: "Servidores, despliegues y servicios propios que tienen que seguir funcionando cuando nadie mira.",
  },
  product: {
    name: "SaaS y productos digitales",
    short: "Producto",
    text: "Software que usan personas cada día, con modelo de negocio, soporte y evolución.",
  },
  ai: {
    name: "Inteligencia artificial y automatización",
    short: "IA",
    text: "IA integrada en procesos de negocio: mensajes, llamadas y flujos que se ejecutan solos.",
  },
};

export const layerOrder: LayerKey[] = ["hardware", "comms", "industrial", "cloud", "product", "ai"];

export const work: Work[] = [
  {
    slug: "syncbiosis",
    name: "Syncbiosis",
    group: "producto",
    category: "SaaS vertical de gestión para escuelas y academias",
    role: "Creador",
    setting: "Producto propio",
    status: "En producción",
    lead: "Una sola plataforma para dirigir escuelas de música, danza e idiomas: matrículas, cobros, horarios y familias.",
    context:
      "Las escuelas de música, danza e idiomas trabajan con una operativa muy concreta (cuotas mensuales, grupos, horarios por aula y profesor, comunicación con las familias) que los programas de gestión genéricos no resuelven bien. Muchas acaban cuadrando hojas de cálculo entre secretaría y dirección.",
    built: [
      "Una plataforma con cuatro productos por disciplina (Musync, Dancsync, Langsync y Classync) sobre la misma base: la operativa se comparte y la interfaz y la terminología cambian por tipo de escuela.",
      "Alumnos y matrículas, cuotas mensuales y remesas SEPA para el banco, control de impagos, horarios y asistencia.",
      "Portal familiar para consultar cuotas, comunicados y horarios desde el móvil.",
      "Facturación preparada para VeriFactu.",
      "La web comercial, los precios y la puesta en marcha con los centros.",
    ],
    stack: ["Next.js", "TypeScript", "Supabase (PostgreSQL)", "Stripe"],
    proves:
      "Capacidad para llevar un producto de software completo al mercado: entender un sector, diseñar un modelo de datos que sirve a varios tipos de centro, cobrar, dar soporte y seguir evolucionándolo con clientes reales.",
    layers: ["product", "cloud"],
    visual: {
      kind: "capture",
      src: "/work/syncbiosis-web.webp",
      alt: "Portada de la web pública de Syncbiosis: «Cobra las cuotas a tiempo y recupera horas cada semana», junto a una vista del panel de la aplicación.",
      width: 1440,
      height: 900,
      caption: "Captura real de la web pública syncbiosis.es · noviembre de 2026",
    },
    links: [{ label: "syncbiosis.es", href: "https://www.syncbiosis.es" }],
    pending: [
      "¿Puedo mencionar la app móvil (Flutter) y la de escritorio (Tauri) que hay en el repositorio, o aún no están publicadas?",
      "¿Año de inicio del proyecto?",
    ],
    weight: 1,
    homeFeature: true,
  },
  {
    slug: "luxops",
    name: "LuxOps",
    group: "producto",
    category: "SaaS de operaciones de campo para instaladoras",
    role: "Diseño y desarrollo de la plataforma",
    setting: "Producto SaaS",
    status: "Lanzado · luxops.es",
    lead: "Del tejado al expediente: la plataforma con la que una instaladora solar o de fibra óptica ejecuta, documenta y legaliza cada instalación.",
    context:
      "En una instaladora, la obra se hace en un tejado o en casa del cliente y la documentación se resuelve después, en la oficina. Entre medias se pierden fotos, números de serie y firmas, y un expediente incompleto retrasa la legalización o la subvención. Normalmente todo pasa por WhatsApp y carpetas compartidas.",
    built: [
      "Un panel de oficina para crear obras, asignarlas a los equipos y seguir su estado, con datos aislados por empresa, roles e invitaciones a los operarios.",
      "Una aplicación web instalable para el técnico, pensada para el móvil: un checklist guiado paso a paso que funciona sin conexión y se sincroniza al recuperarla.",
      "Evidencias desde el propio móvil: fotos con posición GPS y hora, lectura de números de serie con la cámara (códigos de barras, QR y reconocimiento de texto) y firmas en pantalla.",
      "Generación del dossier de la instalación en PDF con los datos de campo y del reglamento de baja tensión (REBT), exportación de los datos para el certificado de instalación eléctrica (CIE) y un paquete descargable para tramitar subvenciones.",
      "Suscripción de pago, emails transaccionales y un segundo vertical para instalaciones de fibra hasta el hogar (FTTH), con su propio flujo de campo.",
    ],
    stack: ["Next.js", "TypeScript", "PostgreSQL (Supabase) + Prisma", "PWA con modo sin conexión", "Stripe", "Resend", "Generación de PDF", "Vitest"],
    proves:
      "Software para personas que trabajan fuera de la oficina: interfaces que funcionan sin cobertura en un tejado, captura de evidencias con el hardware del móvil y documentación que tiene que cumplir un reglamento. Es la pieza que une la instalación física con el sistema de gestión.",
    layers: ["industrial", "product", "cloud"],
    visual: {
      kind: "diagram",
      diagram: "fieldops",
      caption: "Esquema conceptual del flujo de trabajo. No es una captura de la aplicación.",
      extra: {
        src: "/work/luxops-web.webp",
        alt: "Portada de la web pública de LuxOps: «LuxOps: operativa de campo, control total», SaaS para instaladoras solares y de fibra óptica.",
        caption: "Captura real de la web pública luxops.es · noviembre de 2026",
        width: 1440,
        height: 900,
      },
    },
    links: [{ label: "luxops.es", href: "https://www.luxops.es" }],
    pending: [
      "Titularidad: el código es tuyo (89 de 89 commits), pero no consta si LuxOps es solo tuyo o tiene socios. La web habla de «ingeniería colegiada»: ¿hay otra persona detrás?",
      "¿Hay instaladoras usando LuxOps? Sin confirmación no se menciona ningún cliente.",
      "¿El vertical de fibra está en uso o es una ampliación en pruebas?",
      "Avisos por WhatsApp (Twilio): están en el código, ¿están activos en producción?",
      "El pie del PDF dice «firmado mediante hash de integridad según eIDAS», pero el código no calcula ningún hash del documento. Recomiendo revisar esa frase en LuxOps antes de que la use un cliente.",
    ],
    weight: 1,
    homeFeature: true,
  },
  {
    slug: "planit",
    name: "PlanIt",
    group: "producto",
    category: "Plataforma de descubrimiento local con herramientas de publicación",
    role: "Creador",
    setting: "Producto propio",
    status: "MVP desplegado · prelanzamiento",
    lead: "Qué hacer, dónde y con quién: eventos y lugares publicados por quien los organiza, y planes en grupo propuestos por las personas.",
    context:
      "La oferta de ocio de una ciudad está repartida entre redes sociales, webs municipales y carteles. Quien busca un plan no lo encuentra en un solo sitio, y quien lo organiza (un bar, una asociación, un ayuntamiento) no tiene una herramienta sencilla para publicarlo y gestionar a los asistentes.",
    built: [
      "Explorador con mapa y lista sincronizados, filtros por fecha, categoría, precio y distancia, y búsqueda dentro de una zona dibujada en el mapa.",
      "Un estudio para organizadores: entidades con equipo y roles, eventos únicos o recurrentes, lugares, inscripciones con aforo y estadísticas.",
      "Planes en grupo creados por las personas, con aprobación de participantes y chat.",
      "Consola de administración y moderación, y páginas preparadas para buscadores.",
    ],
    stack: ["Next.js", "TypeScript", "PostgreSQL + PostGIS", "MapLibre GL", "Vitest", "Playwright"],
    proves:
      "Diseño de una plataforma de dos lados (quien busca y quien publica) con datos geoespaciales reales, permisos por roles y un modelo de negocio pensado antes de cobrar.",
    layers: ["product", "cloud"],
    visual: {
      kind: "capture",
      src: "/work/planit-web.webp",
      alt: "Portada de PlanIt: «¿Qué hacemos hoy?», con un buscador por ciudad y fecha y categorías de planes.",
      width: 1440,
      height: 900,
      caption: "Captura real de la versión desplegada · noviembre de 2026",
      second: {
        src: "/work/planit-explorar.webp",
        alt: "Explorador de PlanIt: lista de resultados a la izquierda y mapa de España a la derecha con herramientas para dibujar una zona.",
        caption: "Explorador con mapa y herramientas de zona · captura real, aún sin contenido publicado",
      },
    },
    pending: [
      "¿Dominio definitivo? La versión desplegada usa una dirección provisional de Vercel; no la enlazo hasta que lo confirmes.",
    ],
    weight: 1,
  },
  {
    slug: "ecg-raspberry-pi",
    name: "Claves a partir de señales ECG",
    group: "ingenieria",
    category: "Sistemas embebidos y procesamiento de señales",
    role: "Investigador",
    setting: "Investigación universitaria",
    lead: "Dos Raspberry Pi, una señal biológica y un intercambio de datos que depende de ella.",
    context:
      "Proyecto de investigación sobre intercambio de información entre dispositivos embebidos en el que la señal de un electrocardiograma (ECG) se utiliza como origen para generar claves.",
    built: [
      "Un sistema con dos Raspberry Pi: una actuando como gateway y otra como cliente.",
      "En el cliente, la generación de claves a partir de señales ECG.",
      "El intercambio de datos entre ambos nodos.",
    ],
    stack: ["Raspberry Pi", "Señales ECG"],
    proves:
      "Experiencia de ingeniería aplicada en la frontera entre una señal física, el hardware que la procesa y la comunicación entre dispositivos.",
    layers: ["hardware", "comms"],
    visual: { kind: "diagram", diagram: "ecg", caption: "Esquema conceptual del sistema. No describe el algoritmo ni el protocolo." },
    pending: ["¿Universidad o grupo de investigación que se puede citar?", "¿Año?", "¿Lenguajes o bibliotecas utilizados?", "¿Hay publicación o memoria que se pueda enlazar?"],
    weight: 2,
  },
  {
    slug: "software-industrial",
    name: "Software para entornos de fabricación",
    group: "ingenieria",
    category: "Software industrial y monitorización",
    role: "Desarrollador",
    setting: "Experiencia profesional por cuenta ajena",
    lead: "Software con una finalidad operativa: ver qué pasa en producción y enterarse antes de que un fallo vaya a más.",
    context:
      "Trabajo de desarrollo de software para fábricas, donde el software no es un fin en sí mismo: sirve para supervisar procesos productivos y reaccionar a tiempo.",
    built: [
      "Sistemas de detección temprana de errores y anomalías.",
      "Herramientas para visualizar datos de producción.",
      "Integración y visualización de información en Grafana.",
      "Software orientado a mejorar la supervisión de los procesos.",
    ],
    stack: ["Grafana"],
    proves: "Conocimiento directo de los problemas de un entorno productivo y de software que se usa para operar, no solo para consultar.",
    layers: ["industrial"],
    visual: { kind: "diagram", diagram: "industrial", caption: "Esquema conceptual. No reproduce ningún panel ni dato de la empresa." },
    pending: ["¿Periodo aproximado?", "¿Tecnologías de desarrollo que se pueden mencionar, además de Grafana?"],
    weight: 2,
  },
  {
    slug: "monitorizacion-acustica-lorawan",
    name: "Monitorización acústica con LoRaWAN",
    group: "ingenieria",
    category: "IoT de extremo a extremo",
    role: "Autor",
    setting: "Trabajo de Fin de Grado",
    lead: "Del micrófono al panel: medir nivel sonoro, enviarlo por radio de largo alcance y visualizarlo en tiempo real.",
    context:
      "Trabajo de Fin de Grado sobre un sistema de monitorización acústica que integra hardware, comunicaciones inalámbricas y software de monitorización.",
    built: [
      "Un dispositivo basado en Arduino que capta el nivel sonoro.",
      "El envío de los datos mediante LoRaWAN.",
      "La captura y visualización de los datos en tiempo real en Grafana.",
    ],
    stack: ["Arduino", "LoRaWAN", "Grafana"],
    proves: "Una solución IoT completa: adquisición del dato, transmisión inalámbrica y visualización.",
    layers: ["hardware", "comms", "industrial"],
    visual: { kind: "diagram", diagram: "acoustic", caption: "Esquema conceptual del recorrido del dato." },
    pending: [
      "Denominación: uso «nodo de medición de nivel sonoro». «Sonómetro» designa en sentido estricto un instrumento conforme a la norma IEC 61672; ¿el dispositivo se calibró o se comparó con un sonómetro de referencia?",
      "¿Año y titulación? ¿Hay memoria pública que enlazar?",
    ],
    weight: 2,
  },
  {
    slug: "ia-automatizacion",
    name: "IA y automatización de procesos",
    group: "ia",
    category: "Línea de ingeniería aplicada",
    role: "Diseño y desarrollo",
    setting: "Línea de trabajo propia",
    lead: "La IA solo es útil cuando está dentro de un proceso: recibe un mensaje o una llamada, decide y actúa sobre los sistemas del negocio.",
    context:
      "Una línea de trabajo continuada en la que se combinan modelos de IA, flujos automatizados e integraciones entre servicios para quitar trabajo repetitivo a las personas.",
    built: [
      "Automatización de procesos que conectan distintos servicios.",
      "Sistemas de agentes y flujos con IA.",
      "Automatización de llamadas.",
      "Sistemas de comunicación por mensajes con IA.",
    ],
    stack: ["n8n"],
    proves: "Integración de inteligencia artificial en procesos reales de negocio, con las integraciones y la infraestructura que eso exige.",
    layers: ["ai", "cloud"],
    visual: { kind: "diagram", diagram: "automation", caption: "Patrón general de los sistemas. No describe un proyecto concreto." },
    pending: ["¿Qué proveedores de IA, telefonía o mensajería se pueden nombrar?", "¿Alguno de estos sistemas está en uso por un cliente que autorice citarlo?"],
    weight: 3,
  },
  {
    slug: "asistente-ia-salones",
    name: "Asistente con IA para barberías y peluquerías",
    group: "ia",
    category: "Producto en desarrollo",
    role: "Desarrollador en un equipo colaborativo",
    setting: "Proyecto colaborativo",
    status: "En desarrollo",
    lead: "Un chatbot con IA que ayude a barberías, peluquerías y centros de estética a gestionar sus interacciones y tareas.",
    context:
      "Proyecto que el fundador de COTA desarrolla junto a otras personas, dirigido a negocios de servicios personales que atienden muchas consultas y gestionan su día a día con poco tiempo.",
    built: ["El diseño y desarrollo del chatbot con funcionalidades de IA, como parte del equipo."],
    stack: [],
    proves: "Trabajo en equipo sobre un producto de IA, para un sector concreto y desde fases tempranas.",
    layers: ["ai", "product"],
    visual: { kind: "diagram", diagram: "chatbot", caption: "Esquema conceptual. El producto está en desarrollo." },
    pending: ["¿Tu papel exacto en el equipo (desarrollo, IA, producto)? ¿Eres cofundador o colaborador?", "¿Nombre del proyecto y canal (WhatsApp, web…)?"],
    weight: 3,
  },
];

/** Infraestructura: una capacidad transversal, no un proyecto. */
export const infrastructure = {
  title: "Infraestructura que sostiene todo lo anterior",
  text: "Además de desarrollar aplicaciones, desplegamos y mantenemos los servicios sobre los que funcionan: servidores en la nube, automatizaciones autoalojadas y servicios propios que tienen que estar en marcha todos los días.",
  items: [
    { name: "AWS", text: "Despliegue y configuración de servicios en la nube." },
    { name: "Oracle Cloud", text: "Infraestructura montada sobre una instancia de cómputo del nivel gratuito (Always Free) de Oracle Cloud Infrastructure." },
    { name: "n8n", text: "Despliegue de n8n autoalojado para automatizar procesos." },
    { name: "Servicios propios", text: "Configuración y mantenimiento de los servicios de los productos propios." },
  ],
  pending: ["¿Qué servicios de AWS concretos se pueden nombrar?"],
};

export const showDrafts = process.env.VERCEL_ENV !== "production" && process.env.NEXT_PUBLIC_HIDE_DRAFTS !== "true";

export const groupInfo: Record<WorkGroup, { title: string; intro: string }> = {
  producto: {
    title: "Productos",
    intro: "Plataformas SaaS diseñadas, desarrolladas y lanzadas por el fundador de COTA. Capturas reales cuando el producto es público; esquemas rotulados cuando su interfaz no lo es.",
  },
  ingenieria: {
    title: "Ingeniería aplicada e investigación",
    intro: "Investigación universitaria, experiencia profesional y el Trabajo de Fin de Grado del fundador. Trabajos hechos antes de COTA o fuera de ella, y presentados como tales.",
  },
  ia: {
    title: "Inteligencia artificial y automatización",
    intro: "Una línea de trabajo continuada y un producto en desarrollo con otras personas.",
  },
};

export const workBySlug = (slug: string) => work.find((w) => w.slug === slug);
export const workByGroup = (g: WorkGroup) => work.filter((w) => w.group === g);
export const workByLayer = (l: LayerKey) => work.filter((w) => w.layers.includes(l));
