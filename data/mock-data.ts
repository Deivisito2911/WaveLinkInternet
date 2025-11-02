export const PLANS = [
  {
    name: "400mb Plan Premium",
    speed: 400,
    price: 20,
    features: ["Básico", "Residencial"],
    color: "bg-purple-600/30",
    border: "border-purple-500",
  },
  {
    name: "600mb Plan Corocoro",
    speed: 600,
    price: 30,
    features: ["Estándar", "Streaming HD"],
    color: "bg-blue-600/30",
    border: "border-blue-500",
  },
  {
    name: "900mb Plan Chipi Chipi",
    speed: 900,
    price: 40,
    features: ["Premium", "Gaming y 4K"],
    color: "bg-orange-600/30",
    border: "border-orange-500",
  },
]

export const MUNICIPES = [
  "Arismendi",
  "García",
  "Gómez",
  "Maneiro",
  "Marcano",
  "Mariño",
  "Macanao",
  "Tubores",
  "Díaz",
  "Villalba",
  "Antolín del Campo",
]

export const INITIAL_ORDERS = [
  {
    id: 101,
    client: "Carlos Pérez",
    zone: "Mariño",
    type: "Caída Total",
    priority: "Alto",
    status: "PENDIENTE",
    technician: "",
  },
  {
    id: 102,
    client: "Ana Rodríguez",
    zone: "Maneiro",
    type: "Instalación Nueva",
    priority: "Bajo",
    status: "PENDIENTE",
    technician: "",
  },
  {
    id: 103,
    client: "David Gil",
    zone: "García",
    type: "Intermitente",
    priority: "Medio",
    status: "ASIGNADA",
    technician: "Juan B.",
  },
  {
    id: 104,
    client: "Marta López",
    zone: "Tubores",
    type: "Caída Total",
    priority: "Alto",
    status: "PENDIENTE",
    technician: "",
  },
  {
    id: 105,
    client: "Pedro Días",
    zone: "Arismendi",
    type: "Instalación Nueva",
    priority: "Bajo",
    status: "CERRADA",
    technician: "Ana V.",
  },
]

export const TECHNICIANS = ["Juan B.", "Ana V.", "Luis R.", "María S."]

export const PROMOTIONS = [
  { name: "Navidad Neón", discount: "40%", date: "Diciembre", color: "text-red-500" },
  { name: "Semana Santa", discount: "30%", date: "Abril", color: "text-yellow-400" },
  { name: "Día del Padre", discount: "50%", date: "Junio", color: "text-blue-400" },
  { name: "Día de la Madre", discount: "50%", date: "Mayo", color: "text-pink-400" },
]

export type Order = typeof INITIAL_ORDERS[0]
