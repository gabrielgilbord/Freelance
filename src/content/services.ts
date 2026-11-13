export type Service = {
  slug: string;
  index: string;
  /** Nombre comercial en español */
  title: string;
  /** Nombre de la disciplina (inglés, como etiqueta técnica) */
  discipline: string;
  /** Una frase: el resultado que obtiene el cliente */
  pitch: string;
  /** Párrafo de introducción para la página de detalle */
  intro: string;
  /** Situaciones reconocibles del cliente (Jobs To Be Done) */
  problems: string[];
  /** Qué se puede construir */
  deliverables: string[];
  /** Qué gana el negocio */
  outcomes: { title: string; text: string }[];
  /** Cómo se desarrolla este servicio en concreto */
  steps: { title: string; text: string }[];
  /** Tecnología orientativa, siempre subordinada al problema */
  stack: string[];
  faq: { q: string; a: string }[];
  seo: { title: string; description: string };
};

export const services: Service[] = [
  {
    slug: "desarrollo-software",
    index: "01",
    title: "Desarrollo de software a medida",
    discipline: "Software Development",
    pitch: "Aplicaciones web, móviles y de escritorio diseñadas alrededor de cómo trabaja tu negocio, no al revés.",
    intro:
      "Cuando una herramienta estándar se queda corta, el equipo acaba trabajando para el software: hojas de cálculo paralelas, pasos manuales y datos que no cuadran. Desarrollo aplicaciones a medida que encajan con tus procesos reales y que pueden crecer contigo.",
    problems: [
      "Tu operación depende de hojas de cálculo y de que alguien recuerde hacer cada paso.",
      "Has probado herramientas SaaS genéricas y ninguna se adapta a tu forma de trabajar.",
      "Tienes una aplicación antigua que nadie se atreve a tocar y que frena cualquier cambio.",
      "Necesitas una app para tus clientes o tu equipo de campo y no sabes por dónde empezar.",
    ],
    deliverables: [
      "Aplicaciones web y paneles de gestión internos",
      "Plataformas SaaS multiusuario con roles, facturación y permisos",
      "Aplicaciones móviles iOS y Android",
      "Software de escritorio para entornos de oficina o planta",
      "Modernización progresiva de sistemas heredados",
    ],
    outcomes: [
      { title: "Procesos sin fricción", text: "La herramienta refleja tu flujo real: menos pasos manuales y menos errores." },
      { title: "Un activo propio", text: "El código y los datos son tuyos. Sin depender de las decisiones de un proveedor genérico." },
      { title: "Preparado para crecer", text: "Arquitectura pensada para añadir funciones sin rehacer lo que ya funciona." },
    ],
    steps: [
      { title: "Mapa del proceso", text: "Documentamos cómo se trabaja hoy y dónde se pierde tiempo o información." },
      { title: "Prototipo navegable", text: "Validas pantallas y flujos antes de escribir la lógica completa." },
      { title: "Entregas iterativas", text: "Versiones funcionales cada pocas semanas, usables por tu equipo desde el principio." },
      { title: "Puesta en producción", text: "Despliegue, migración de datos y formación para que el cambio sea ordenado." },
    ],
    stack: ["TypeScript", "React / Next.js", "React Native", "Node.js", "Python", "PostgreSQL", "Electron / Tauri"],
    faq: [
      {
        q: "¿Web, móvil o escritorio?",
        a: "Depende de quién lo usa y dónde. Lo decidimos en la fase de descubrimiento; a menudo una aplicación web bien hecha cubre escritorio y móvil con un solo código.",
      },
      {
        q: "¿Puedo empezar con una versión pequeña?",
        a: "Sí, y suele ser lo recomendable. Definimos un primer alcance que aporte valor real y lo ampliamos con lo que aprendamos de su uso.",
      },
      {
        q: "¿Quién es el propietario del código?",
        a: "Tú. Se entrega el código fuente, la documentación y los accesos a la infraestructura.",
      },
    ],
    seo: {
      title: "Desarrollo de software y aplicaciones a medida",
      description:
        "Desarrollo de aplicaciones web, móviles, de escritorio y plataformas SaaS a medida. Software diseñado alrededor de tus procesos, con código y datos en propiedad.",
    },
  },
  {
    slug: "inteligencia-artificial",
    index: "02",
    title: "Inteligencia artificial aplicada",
    discipline: "Artificial Intelligence",
    pitch: "IA integrada en tus procesos para resolver tareas concretas, con resultados medibles y bajo control.",
    intro:
      "La inteligencia artificial aporta valor cuando resuelve un trabajo concreto: leer documentos, responder con la información correcta, clasificar, extraer o decidir el siguiente paso. Diseño e integro soluciones de IA que se conectan con tus datos y tus sistemas, con límites claros y evaluaciones que demuestran si funcionan.",
    problems: [
      "Tu equipo dedica horas a leer, resumir o copiar información de documentos y correos.",
      "El conocimiento de la empresa está repartido en manuales, PDFs y en la cabeza de pocas personas.",
      "Quieres incorporar IA a tu producto, pero no sabes qué es viable ni cuánto costaría operarlo.",
      "Has probado un chatbot genérico y responde con seguridad cosas que no son ciertas.",
    ],
    deliverables: [
      "Asistentes que responden con tu documentación (RAG) y citan sus fuentes",
      "Extracción y clasificación de datos en documentos, emails y formularios",
      "Agentes que ejecutan tareas en varios sistemas con supervisión humana",
      "Funcionalidades de IA dentro de tu aplicación o SaaS",
      "Evaluación de casos de uso y prueba de concepto antes de invertir a fondo",
    ],
    outcomes: [
      { title: "Tiempo recuperado", text: "Las tareas repetitivas de lectura y transcripción pasan a ser revisión." },
      { title: "Respuestas trazables", text: "Cada respuesta indica de dónde sale, para poder verificarla." },
      { title: "Costes previsibles", text: "Elección de modelos y arquitectura en función del coste por uso, no de la moda." },
    ],
    steps: [
      { title: "Caso de uso y datos", text: "Identificamos la tarea, los datos disponibles y cómo medir el éxito." },
      { title: "Prueba de concepto", text: "Un prototipo acotado con un conjunto de evaluación real para decidir con datos." },
      { title: "Integración", text: "Conexión con tus sistemas, permisos, registro de actividad y control humano donde haga falta." },
      { title: "Seguimiento", text: "Métricas de calidad y coste en producción para ajustar con el tiempo." },
    ],
    stack: ["LLMs (Claude, GPT, modelos abiertos)", "RAG y búsqueda vectorial", "Python", "TypeScript", "Evaluaciones automáticas", "MCP / tool use"],
    faq: [
      {
        q: "¿Mis datos se usan para entrenar modelos?",
        a: "Se trabaja con proveedores y configuraciones que no entrenan con tus datos, o con modelos desplegados en tu propia infraestructura cuando la sensibilidad lo requiere.",
      },
      {
        q: "¿Cómo sé si la IA funciona bien?",
        a: "Antes de construir definimos un conjunto de casos de prueba con respuestas esperadas. La solución se mide contra él en cada cambio.",
      },
      {
        q: "¿Y si la IA se equivoca?",
        a: "El diseño asume que puede equivocarse: validaciones, umbrales de confianza y revisión humana en las decisiones que importan.",
      },
    ],
    seo: {
      title: "Desarrollo de software con inteligencia artificial",
      description:
        "Integración de inteligencia artificial en empresas: asistentes con tu documentación, extracción de datos, agentes y funcionalidades de IA en tu producto, con evaluación y control de costes.",
    },
  },
  {
    slug: "iot-sistemas-conectados",
    index: "03",
    title: "IoT y sistemas conectados",
    discipline: "IoT & Connected Systems",
    pitch: "Del sensor al panel de control: sistemas que miden el mundo físico y convierten esos datos en decisiones.",
    intro:
      "Un proyecto IoT no termina en el dispositivo. Hay que capturar el dato de forma fiable, transmitirlo, almacenarlo, interpretarlo y avisar a la persona adecuada en el momento adecuado. Diseño y desarrollo la cadena completa, desde el firmware hasta la aplicación que usa tu equipo.",
    problems: [
      "Necesitas saber qué ocurre en tus instalaciones o máquinas sin estar físicamente allí.",
      "Tus equipos generan datos que nadie recoge o que se quedan en un dispositivo aislado.",
      "Las incidencias se detectan tarde porque dependen de una revisión manual.",
      "Tienes un prototipo de hardware y te falta la plataforma que lo convierta en producto.",
    ],
    deliverables: [
      "Firmware para microcontroladores y pasarelas (ESP32, Raspberry Pi y similares)",
      "Comunicación de dispositivos (MQTT, HTTP, BLE, LoRaWAN)",
      "Plataformas de ingesta, almacenamiento de series temporales y alertas",
      "Paneles de monitorización y aplicaciones de control remoto",
      "Integración con maquinaria y sistemas existentes",
    ],
    outcomes: [
      { title: "Visibilidad en tiempo real", text: "Sabes el estado de lo que importa sin desplazarte." },
      { title: "Reacción temprana", text: "Alertas automáticas antes de que una incidencia se convierta en pérdida." },
      { title: "Datos históricos", text: "Información acumulada para mantenimiento, auditoría y mejora." },
    ],
    steps: [
      { title: "Qué medir y por qué", text: "Definimos variables, frecuencia, entorno físico y qué decisión dependerá de cada dato." },
      { title: "Prototipo de extremo a extremo", text: "Un dispositivo real enviando datos a una plataforma real, aunque sea pequeña." },
      { title: "Robustez", text: "Reconexiones, almacenamiento local, consumo energético, seguridad y actualizaciones remotas." },
      { title: "Despliegue y escala", text: "Instalación, alta de dispositivos y operación de la flota." },
    ],
    stack: ["C / C++", "MicroPython", "ESP32", "MQTT", "Node.js / Python", "TimescaleDB / InfluxDB", "Grafana o panel a medida"],
    faq: [
      {
        q: "¿Diseñas también el hardware?",
        a: "Trabajo la integración de hardware y software: selección de componentes, sensores, prototipos y firmware. Para diseño de PCB de producción o certificaciones se coordina con especialistas.",
      },
      {
        q: "¿Qué pasa si se cae la conexión?",
        a: "Los dispositivos se diseñan para almacenar datos localmente y reenviarlos al recuperar la conexión, sin perder información.",
      },
    ],
    seo: {
      title: "Desarrollo IoT y sistemas conectados",
      description:
        "Desarrollo IoT de extremo a extremo: firmware, sensores, comunicación MQTT, plataformas de datos, alertas y paneles de control para empresas e industria.",
    },
  },
  {
    slug: "arquitectura-software",
    index: "04",
    title: "Arquitectura de software",
    discipline: "Software Architecture",
    pitch: "Decisiones técnicas que aguantan el crecimiento: estructura, datos, integraciones y costes pensados antes de construir.",
    intro:
      "Las decisiones de arquitectura son las más caras de cambiar. Te ayudo a definir cómo se estructura un sistema nuevo o a reordenar uno que ha crecido sin plan, con criterios explícitos de escalabilidad, seguridad, coste y mantenimiento.",
    problems: [
      "Vas a construir un producto y quieres que la base técnica no sea un problema en un año.",
      "Cada cambio en tu sistema actual rompe algo en otro sitio.",
      "La factura de infraestructura crece más rápido que el uso.",
      "Necesitas una segunda opinión técnica antes de aprobar una propuesta o contratar un equipo.",
    ],
    deliverables: [
      "Diseño de arquitectura para productos nuevos",
      "Auditoría técnica de sistemas existentes con plan de mejora priorizado",
      "Modelado de datos y diseño de APIs",
      "Estrategia de infraestructura cloud y despliegue",
      "Documentación de decisiones (ADR) y diagramas de sistema",
    ],
    outcomes: [
      { title: "Menos deuda técnica", text: "Una base ordenada donde los cambios cuestan lo que deben costar." },
      { title: "Decisiones explicadas", text: "Cada elección queda documentada con sus alternativas y consecuencias." },
      { title: "Coste bajo control", text: "Infraestructura dimensionada para el uso real, no para el peor caso imaginado." },
    ],
    steps: [
      { title: "Requisitos reales", text: "Volumen, usuarios, integraciones, seguridad y presupuesto: los datos que condicionan el diseño." },
      { title: "Alternativas", text: "Dos o tres enfoques comparados con sus ventajas, riesgos y costes." },
      { title: "Diseño y documentación", text: "Diagramas, modelo de datos, contratos de API y decisiones registradas." },
      { title: "Acompañamiento", text: "Implementación propia o apoyo a tu equipo para que el diseño se respete." },
    ],
    stack: ["Diagramas C4", "ADRs", "Cloud (AWS, GCP, Azure, Vercel)", "Contenedores", "Event-driven", "PostgreSQL", "OpenAPI"],
    faq: [
      {
        q: "¿Microservicios o monolito?",
        a: "Para la mayoría de proyectos, un monolito bien modularizado es más rápido de construir y más barato de operar. Se separan servicios cuando hay un motivo concreto.",
      },
      {
        q: "¿Puedes revisar el trabajo de otro equipo?",
        a: "Sí. Una auditoría técnica independiente es útil antes de una inversión, una adquisición o un cambio de proveedor.",
      },
    ],
    seo: {
      title: "Arquitectura de software y auditoría técnica",
      description:
        "Diseño de arquitectura de software, auditoría técnica, modelado de datos, APIs y estrategia cloud para productos que necesitan crecer sin rehacerse.",
    },
  },
  {
    slug: "automatizacion",
    index: "05",
    title: "Automatización e integraciones",
    discipline: "Digital Automation",
    pitch: "Conecto tus herramientas y elimino el trabajo manual repetitivo entre sistemas.",
    intro:
      "Gran parte del tiempo de un equipo se va en mover datos de un sitio a otro: del email al ERP, del formulario al CRM, del Excel al informe. Automatizo esos flujos con integraciones robustas, con registro de lo que ocurre y con avisos cuando algo necesita una persona.",
    problems: [
      "Copiar y pegar entre aplicaciones ocupa horas cada semana.",
      "Tus herramientas no se hablan entre sí y los datos se desincronizan.",
      "Los informes se preparan a mano y llegan tarde.",
      "Has montado automatizaciones sueltas que fallan sin que nadie se entere.",
    ],
    deliverables: [
      "Integraciones entre CRM, ERP, ecommerce, facturación y herramientas internas",
      "Flujos automáticos con n8n, Make o código a medida según el caso",
      "Procesamiento automático de documentos y correos",
      "APIs y conectores para sistemas que no tienen integración",
      "Informes y cuadros de mando generados automáticamente",
    ],
    outcomes: [
      { title: "Horas devueltas", text: "El equipo deja de transcribir datos y se dedica a lo que requiere criterio." },
      { title: "Datos coherentes", text: "Una sola fuente de verdad sincronizada entre herramientas." },
      { title: "Fallos visibles", text: "Registro y alertas: si algo falla, se sabe y se puede reintentar." },
    ],
    steps: [
      { title: "Inventario de tareas", text: "Medimos qué tareas repetitivas existen, cuánto tiempo consumen y cuánto riesgo tienen." },
      { title: "Priorización", text: "Empezamos por la automatización con mejor relación entre impacto y esfuerzo." },
      { title: "Construcción robusta", text: "Gestión de errores, reintentos, registro y pruebas con datos reales." },
      { title: "Traspaso", text: "Documentación para que tu equipo entienda qué hace cada flujo." },
    ],
    stack: ["n8n", "Make", "Node.js", "Python", "APIs REST / Webhooks", "Colas y tareas programadas"],
    faq: [
      {
        q: "¿Herramientas no-code o código?",
        a: "Lo que sea más fiable y mantenible para tu caso. Herramientas como n8n son excelentes para muchos flujos; el código a medida entra cuando hay lógica compleja o volumen alto.",
      },
      {
        q: "¿Qué pasa si una API externa cambia?",
        a: "Las integraciones se construyen con adaptadores aislados y alertas, de modo que un cambio externo se detecta y se corrige en un único punto.",
      },
    ],
    seo: {
      title: "Automatización de procesos empresariales e integraciones",
      description:
        "Automatización empresarial e integración de sistemas: CRM, ERP, ecommerce, documentos y correos. Flujos robustos con n8n, Make o código a medida.",
    },
  },
  {
    slug: "producto-digital",
    index: "06",
    title: "Producto digital desde cero",
    discipline: "Custom Digital Products",
    pitch: "Si tienes una idea, te ayudo a convertirla en un producto real: definición, primera versión y lanzamiento.",
    intro:
      "Una idea de producto necesita más que programación: decidir qué construir primero, qué dejar fuera y cómo comprobar que alguien lo quiere. Acompaño a emprendedores y empresas desde la idea hasta un producto en manos de usuarios reales, con criterio técnico y de producto.",
    problems: [
      "Tienes una idea clara del problema, pero no del producto que lo resuelve.",
      "Has recibido presupuestos muy distintos y no sabes cuál tiene sentido.",
      "Necesitas una primera versión para validar con clientes o presentar a inversores.",
      "Te preocupa invertir meses en algo que luego nadie use.",
    ],
    deliverables: [
      "Taller de definición de producto y alcance de la primera versión (MVP)",
      "Prototipos interactivos para validar con usuarios",
      "Desarrollo del MVP web, móvil o con hardware",
      "Analítica de uso para decidir los siguientes pasos",
      "Hoja de ruta técnica para crecer después del lanzamiento",
    ],
    outcomes: [
      { title: "Foco", text: "Un alcance pequeño y valioso en lugar de una lista infinita de funciones." },
      { title: "Velocidad con criterio", text: "Lanzar pronto sin hipotecar la base técnica." },
      { title: "Decisiones con datos", text: "Medición desde el primer día para saber qué funciona." },
    ],
    steps: [
      { title: "De la idea al problema", text: "Concretamos a quién sirve el producto, qué problema resuelve y cómo se va a medir." },
      { title: "Alcance mínimo", text: "Definimos la versión más pequeña que permite aprender algo importante." },
      { title: "Construcción", text: "Desarrollo en ciclos cortos con versiones que puedes enseñar." },
      { title: "Lanzamiento y aprendizaje", text: "Publicación, analítica y priorización de la siguiente iteración." },
    ],
    stack: ["Next.js", "React Native", "Supabase / PostgreSQL", "Stripe", "Analítica de producto", "Vercel / cloud"],
    faq: [
      {
        q: "No tengo conocimientos técnicos, ¿es un problema?",
        a: "No. Parte del trabajo es traducir decisiones técnicas a consecuencias de negocio: coste, plazo y riesgo.",
      },
      {
        q: "¿Cuánto cuesta un MVP?",
        a: "Depende del alcance. Tras una primera conversación recibirás una estimación por fases para decidir con información.",
      },
    ],
    seo: {
      title: "Desarrollo de MVP y productos digitales",
      description:
        "Desarrollo de productos digitales desde cero para emprendedores y empresas: definición, prototipo, MVP, lanzamiento y hoja de ruta técnica.",
    },
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
