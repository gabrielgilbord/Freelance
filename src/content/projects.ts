import type { Project } from "@/lib/projects/types";

/**
 * IMPORTANTE: todos los proyectos de este archivo son CONCEPTOS / DEMOS TÉCNICAS.
 * No representan clientes ni resultados reales. Sirven para mostrar el tipo de
 * problema que se puede abordar y cómo se plantearía la solución.
 *
 * Para añadir un proyecto real: copia uno de estos objetos, usa status "client"
 * o "product", sustituye successCriteria por results (solo cifras verificables)
 * y añade imágenes en /public/projects/<slug>/.
 */
export const projects: Project[] = [
  {
    slug: "telemetria-camaras-frigorificas",
    status: "concept",
    title: "Telemetría para cámaras frigoríficas",
    sector: "Alimentación · Logística en frío",
    summary:
      "Sistema IoT que vigila la temperatura y la apertura de puertas de cámaras frigoríficas y avisa antes de que la mercancía se eche a perder.",
    problem:
      "En muchas cámaras frigoríficas la temperatura se comprueba a mano unas pocas veces al día. Una puerta mal cerrada o un compresor que falla de noche puede no detectarse hasta la mañana siguiente, con la mercancía ya perdida y sin un registro fiable para auditorías de seguridad alimentaria.",
    solution:
      "Sensores de temperatura y de puerta conectados a un microcontrolador que envía lecturas por MQTT cada minuto y guarda datos en local si se pierde la conexión. Una plataforma recibe las lecturas, las almacena como series temporales, evalúa reglas de alerta con histéresis para evitar falsos avisos y notifica por SMS o mensajería. El panel web muestra el estado de cada cámara y exporta el registro histórico para auditorías.",
    services: ["iot-sistemas-conectados", "desarrollo-software", "arquitectura-software"],
    stack: ["ESP32", "C++", "MQTT", "Node.js", "TimescaleDB", "Next.js", "Notificaciones push / SMS"],
    architecture: [
      { name: "Dispositivo", parts: ["Sondas de temperatura", "Sensor de puerta", "ESP32 con buffer local"] },
      { name: "Transporte", parts: ["Broker MQTT con TLS", "Reintentos y reenvío"] },
      { name: "Plataforma", parts: ["Ingesta", "Series temporales", "Motor de reglas y alertas"] },
      { name: "Interfaz", parts: ["Panel web", "Notificaciones", "Exportación para auditoría"] },
    ],
    successCriteria: [
      "Tiempo entre la anomalía y el aviso inferior a 5 minutos",
      "Cero lecturas perdidas durante cortes de red de hasta 24 horas",
      "Registro exportable válido para auditorías de seguridad alimentaria",
    ],
    featured: true,
  },
  {
    slug: "asistente-documentacion-interna",
    status: "concept",
    title: "Asistente de documentación técnica con IA",
    sector: "Industria · Servicio técnico",
    summary:
      "Asistente que responde a técnicos de campo usando los manuales y procedimientos de la empresa, citando el documento y la página exacta.",
    problem:
      "Los técnicos pierden tiempo buscando en cientos de manuales en PDF, o llaman a la única persona veterana que conoce la respuesta. Un chatbot genérico no conoce la documentación interna y puede inventar procedimientos, algo inaceptable cuando hay seguridad de por medio.",
    solution:
      "Ingesta de manuales y procedimientos con extracción de texto, tablas y estructura. Búsqueda híbrida (semántica y por palabras clave) para recuperar los fragmentos relevantes y un modelo de lenguaje que responde solo con esa información, enlazando cada afirmación a su fuente. Si no encuentra respaldo, lo dice. Un conjunto de evaluación con preguntas reales mide la calidad antes de cada cambio.",
    services: ["inteligencia-artificial", "desarrollo-software"],
    stack: ["Python", "PostgreSQL + pgvector", "LLM vía API", "Evaluaciones automáticas", "Next.js", "Autenticación corporativa"],
    architecture: [
      { name: "Ingesta", parts: ["Lectura de PDF", "Troceado por secciones", "Embeddings"] },
      { name: "Recuperación", parts: ["Búsqueda híbrida", "Reordenación", "Filtros por permisos"] },
      { name: "Generación", parts: ["LLM con instrucciones acotadas", "Citas obligatorias", "Respuesta 'no lo sé'"] },
      { name: "Control", parts: ["Conjunto de evaluación", "Registro de consultas", "Feedback de técnicos"] },
    ],
    successCriteria: [
      "Más del 90 % de respuestas correctas en el conjunto de evaluación",
      "100 % de respuestas con cita a documento y página",
      "Reducción medible del tiempo de búsqueda frente al proceso actual",
    ],
    featured: true,
  },
  {
    slug: "automatizacion-pedidos-email",
    status: "concept",
    title: "Entrada automática de pedidos desde email",
    sector: "Distribución · B2B",
    summary:
      "Flujo que lee los pedidos que llegan por email en PDF o Excel, extrae líneas y cantidades y las registra en el ERP tras una validación.",
    problem:
      "Un distribuidor recibe cada día decenas de pedidos por email, cada cliente con su propio formato. Una persona los teclea a mano en el ERP: es lento, provoca errores en referencias y cantidades y retrasa la preparación.",
    solution:
      "Un buzón dedicado recibe los pedidos. Un servicio extrae los datos con un modelo de IA, los normaliza contra el catálogo de productos y el maestro de clientes, y calcula un nivel de confianza. Los pedidos claros se registran automáticamente en el ERP mediante su API; los dudosos llegan a una bandeja de revisión donde una persona los confirma en segundos.",
    services: ["automatizacion", "inteligencia-artificial"],
    stack: ["n8n", "Python", "LLM con salida estructurada", "API del ERP", "PostgreSQL", "Panel de revisión"],
    architecture: [
      { name: "Entrada", parts: ["Buzón de pedidos", "Lectura de adjuntos"] },
      { name: "Extracción", parts: ["IA con esquema de salida", "Normalización contra catálogo"] },
      { name: "Decisión", parts: ["Umbral de confianza", "Bandeja de revisión humana"] },
      { name: "Integración", parts: ["Adaptador ERP", "Registro y reintentos", "Aviso al cliente"] },
    ],
    successCriteria: [
      "Porcentaje de pedidos registrados sin intervención manual",
      "Errores de referencia o cantidad por debajo del proceso manual",
      "Tiempo desde la recepción hasta el registro en el ERP",
    ],
    featured: true,
  },
];
