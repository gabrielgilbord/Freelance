export const workProcess = [
  {
    key: "discovery",
    name: "Discovery",
    title: "Entender el problema",
    text: "Antes de hablar de tecnología, entiendo tu negocio, a quién afecta el problema y qué significa que el proyecto salga bien.",
    output: "Resumen del problema y criterios de éxito",
  },
  {
    key: "strategy",
    name: "Strategy",
    title: "Definir la solución",
    text: "Propongo qué construir, qué no construir todavía y por qué. Alcance, fases, riesgos y una estimación por etapas.",
    output: "Propuesta de solución y presupuesto por fases",
  },
  {
    key: "architecture",
    name: "Architecture",
    title: "Diseñar la estructura",
    text: "Elijo tecnologías, modelo de datos e integraciones en función de tus requisitos reales de escala, seguridad y coste.",
    output: "Diagrama de sistema y decisiones documentadas",
  },
  {
    key: "development",
    name: "Development",
    title: "Construir el producto",
    text: "Desarrollo en ciclos cortos con versiones funcionales que puedes probar. Sin desaparecer meses para volver con una sorpresa.",
    output: "Entregas funcionales cada pocas semanas",
  },
  {
    key: "deployment",
    name: "Deployment",
    title: "Ponerlo en producción",
    text: "Despliegue, monitorización, copias de seguridad y migración de datos. El sistema funcionando en su entorno real.",
    output: "Sistema en producción y documentación",
  },
  {
    key: "evolution",
    name: "Evolution",
    title: "Mantener y mejorar",
    text: "Soporte, corrección de incidencias y nuevas funciones a partir de lo que enseña el uso real.",
    output: "Plan de mantenimiento y mejoras priorizadas",
  },
] as const;
