"use client"

import { useState, useMemo, useCallback } from "react"
import {
  Mail,
  Zap,
  Settings,
  MapPin,
  TrendingUp,
  Calendar,
  BarChart3,
  ChevronRight,
  AlertTriangle,
  X,
} from "lucide-react"
import Image from "next/image"

// --- Datos Ficticios (Simulación de DB) ---
const PLANS = [
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

const MUNICIPES = [
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

const INITIAL_ORDERS = [
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

const TECHNICIANS = ["Juan B.", "Ana V.", "Luis R.", "María S."]

const PROMOTIONS = [
  { name: "Navidad Neón", discount: "40%", date: "Diciembre", color: "text-red-500" },
  { name: "Semana Santa", discount: "30%", date: "Abril", color: "text-yellow-400" },
  { name: "Día del Padre", discount: "50%", date: "Junio", color: "text-blue-400" },
  { name: "Día de la Madre", discount: "50%", date: "Mayo", color: "text-pink-400" },
]

// Función para simular estadísticas de fallas por municipio
const generateZoneStats = (orders) => {
  const counts = orders.reduce((acc, order) => {
    acc[order.zone] = (acc[order.zone] || 0) + (order.status === "PENDIENTE" || order.status === "ASIGNADA" ? 1 : 0)
    return acc
  }, {})

  // Crear datos para la gráfica (simulando municipios con más fallas)
  return Object.keys(counts)
    .map((zone) => ({
      zone,
      count: counts[zone],
      color: counts[zone] > 1 ? "#FFA500" : "#8A2BE2", // Naranja para zonas críticas
    }))
    .sort((a, b) => b.count - a.count)
}

// --- Componentes Compartidos (Estilo Retro-Futurista) ---

const Card = ({ children, title, icon: Icon, className = "" }) => (
  <div
    className={`bg-gray-800 p-6 rounded-xl border border-purple-700/50 shadow-[0_0_15px_rgba(138,43,226,0.5)] ${className}`}
  >
    <div className="flex items-center mb-4">
      {Icon && <Icon className="w-6 h-6 mr-2 text-orange-400" />}
      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 uppercase tracking-widest">
        {title}
      </h2>
    </div>
    {children}
  </div>
)

const RetroButton = ({ children, onClick, color = "purple" }) => {
  let baseColor = "bg-purple-600 hover:bg-purple-700 shadow-purple-900/50"
  if (color === "orange") baseColor = "bg-orange-600 hover:bg-orange-700 shadow-orange-900/50"
  if (color === "blue") baseColor = "bg-blue-600 hover:bg-blue-700 shadow-blue-900/50"

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-semibold text-white rounded-lg transition-all duration-150 transform hover:scale-[1.03] ${baseColor} shadow-lg border border-white/20`}
    >
      {children}
    </button>
  )
}

// --- Vistas del Módulo ---

const PlanesView = () => {
  const [rating, setRating] = useState(5)
  const [comments, setComments] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [qualityMessage, setQualityMessage] = useState(null)

  const handleQualitySubmit = (e) => {
    e.preventDefault()
    setQualityMessage("✅ ¡Feedback enviado! Gracias por ayudarnos a mejorar nuestros servicios.")
    setRating(5)
    setComments("")
    setIsAnonymous(false)
    setTimeout(() => setQualityMessage(null), 5000)
  }

  return (
    <div className="space-y-10">
      <Card title="Planes de Servicio WaveLink" icon={Zap} className="bg-gray-900/50">
        <p className="text-gray-300 mb-6">Conéctate a la velocidad del futuro con nuestros planes de fibra óptica.</p>

        {/* Sección 2: Pasarela de Promociones */}
        <div className="overflow-hidden mb-8">
          <div className="flex animate-marquee space-x-8 p-3 bg-purple-900/30 rounded-lg border border-purple-500/50 shadow-inner">
            <style jsx global>{`
              @keyframes marquee {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
              .animate-marquee {
                display: flex;
                width: 200%; /* Duplicar el ancho para el efecto */
                animation: marquee 20s linear infinite;
              }
            `}</style>
            {/* Duplicar las promociones para el loop continuo */}
            {[...PROMOTIONS, ...PROMOTIONS].map((promo, index) => (
              <span key={index} className={`flex-shrink-0 text-lg font-mono ${promo.color} tracking-wider mr-8`}>
                ⚡ {promo.name}: {promo.discount} OFF en {promo.date}! ⚡
              </span>
            ))}
          </div>
        </div>

        {/* Muestra de Planes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, index) => (
            <div
              key={index}
              className={`p-6 ${plan.color} ${plan.border} border-2 rounded-xl text-center transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(255,165,0,0.7)]`}
            >
              <h3 className="text-2xl font-extrabold text-orange-300 mb-2">{plan.name}</h3>
              <p className="text-4xl font-black mb-4 text-white">
                ${plan.price}
                <span className="text-base text-gray-300">/mes</span>
              </p>
              <p className="text-5xl font-mono text-blue-400 mb-4">{plan.speed}MB</p>
              <ul className="text-sm text-gray-200 space-y-1 mb-6">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-orange-400 mr-1" /> {feat}
                  </li>
                ))}
              </ul>
              <RetroButton color="orange">Contratar Plan</RetroButton>
            </div>
          ))}
        </div>
      </Card>

      {/* Sección 3: Gestión de Calidad (Opiniones) */}
      <Card title="Gestión de Calidad y Opiniones" icon={TrendingUp}>
        <p className="text-gray-300 mb-4">
          Ayúdenos a mejorar su servicio. Su opinión es registrada para optimizar WaveLink.
        </p>

        {qualityMessage && (
          <div className="p-4 mb-4 text-sm text-green-100 bg-green-700/50 rounded-lg shadow-xl border border-green-500">
            {qualityMessage}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleQualitySubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Calidad de la Fibra: {rating}/5</label>
            <input
              type="range"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Comentarios (Opcional)</label>
            <textarea
              rows={2}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-purple-500 rounded-lg focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="anonimo"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 text-orange-400 border-gray-600 rounded focus:ring-orange-500 mr-2"
            />
            <label htmlFor="anonimo" className="text-sm text-gray-300">
              Realizar opinión de forma anónima.
            </label>
          </div>
          <RetroButton color="purple" type="submit">
            Enviar Feedback
          </RetroButton>
        </form>
      </Card>
    </div>
  )
}

const ReporteClienteView = ({ setView }) => {
  const [tickets, setTickets] = useState(INITIAL_ORDERS.filter((o) => o.client === "Carlos Pérez"))
  const [newTicket, setNewTicket] = useState({ problem: "", zone: MUNICIPES[0], date: "", type: "falla" })
  const [successMessage, setSuccessMessage] = useState(null)

  const handleReportSubmit = (e) => {
    e.preventDefault()
    setSuccessMessage(
      `Ticket #${Math.floor(Math.random() * 1000) + 200} creado con éxito para la zona de ${newTicket.zone}. Esté atento a su Historial de Tickets.`,
    )
    setTimeout(() => setSuccessMessage(null), 5000)
    // Simulación: No se agrega a la lista de tickets, solo muestra el mensaje.
  }

  const isInstallation = newTicket.type === "instalacion"

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        {/* Sección 4/5: Reporte de Falla / Solicitud de Instalación */}
        <Card
          title={isInstallation ? "Solicitud de Instalación" : "Reporte de Falla"}
          icon={isInstallation ? Calendar : AlertTriangle}
        >
          <p className="text-gray-300 mb-4">
            Digitaliza tu solicitud. Nuestro sistema geolocalizará la ubicación y asignará automáticamente.
          </p>

          {successMessage && (
            <div className="p-4 mb-4 text-sm text-green-100 bg-green-700/50 rounded-lg shadow-xl border border-green-500">
              {successMessage}
            </div>
          )}

          <div className="flex flex-col sm:flex-row mb-6 gap-4">
            <RetroButton
              color={!isInstallation ? "orange" : "purple"}
              onClick={() => setNewTicket((prev) => ({ ...prev, type: "falla" }))}
            >
              Reportar Falla
            </RetroButton>
            <RetroButton
              color={isInstallation ? "orange" : "purple"}
              onClick={() => setNewTicket((prev) => ({ ...prev, type: "instalacion" }))}
            >
              Solicitar Instalación
            </RetroButton>
          </div>

          <form className="space-y-4" onSubmit={handleReportSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Zona / Municipio</label>
              <select
                className="w-full p-3 bg-gray-700 border border-purple-500 rounded-lg focus:ring-blue-500"
                value={newTicket.zone}
                onChange={(e) => setNewTicket((prev) => ({ ...prev, zone: e.target.value }))}
                required
              >
                {MUNICIPES.map((mun) => (
                  <option key={mun} value={mun}>
                    {mun}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">WaveLink atiende fallas según la zona seleccionada.</p>
            </div>

            {!isInstallation ? (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Descripción del Problema</label>
                <textarea
                  rows="3"
                  placeholder="Mi servicio se cayó totalmente. El router no enciende la luz PON."
                  className="w-full p-3 bg-gray-700 border border-purple-500 rounded-lg focus:ring-blue-500"
                  required
                ></textarea>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Fecha Deseada</label>
                <input
                  type="date"
                  required
                  className="w-full p-3 bg-gray-700 border border-purple-500 rounded-lg focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Nota: El calendario interactivo solo permite días hábiles.</p>
              </div>
            )}

            <div className="w-full">
              <RetroButton color="blue" type="submit">
                Generar Órden de Servicio
              </RetroButton>
            </div>
          </form>
        </Card>
      </div>

      <div className="lg:col-span-1">
        {/* Historial de Tickets */}
        <Card title="Historial de Tickets" icon={Mail} className="h-full">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`p-3 rounded-lg border ${ticket.status === "CERRADA" ? "border-green-500/50 bg-green-900/20" : "border-orange-500/50 bg-orange-900/20"}`}
              >
                <p className="font-semibold text-white">
                  Ticket #{ticket.id} ({ticket.priority})
                </p>
                <p className="text-sm text-gray-300">
                  {ticket.type} en {ticket.zone}
                </p>
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded-full mt-1 inline-block ${ticket.status === "PENDIENTE" ? "bg-red-500" : ticket.status === "ASIGNADA" ? "bg-blue-500" : "bg-green-500"}`}
                >
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

const AdminView = () => {
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [sortBy, setSortBy] = useState("id")
  const [techFilter, setTechFilter] = useState("")

  const zoneStats = useMemo(() => generateZoneStats(orders), [orders])

  const sortedOrders = useMemo(() => {
    let filtered = orders
    if (techFilter) {
      filtered = orders.filter((o) => o.zone === techFilter)
    }

    return filtered.sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = { Alto: 3, Medio: 2, Bajo: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return a.id - b.id
    })
  }, [orders, sortBy, techFilter])

  const handleAssignTech = useCallback((id, tech) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, technician: tech, status: "ASIGNADA" } : order)),
    )
  }, [])

  const getStatusColor = (status) => {
    if (status === "PENDIENTE") return "bg-red-600/50 border-red-500"
    if (status === "ASIGNADA") return "bg-blue-600/50 border-blue-500"
    return "bg-green-600/50 border-green-500"
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-orange-400 mb-6 border-b border-purple-500/50">
        Panel de Administración de Órdenes
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 1. Tabla de Órdenes Pendientes */}
        <div className="lg:col-span-2">
          <Card title="Órdenes de Servicio Pendientes" icon={Settings}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="text-gray-300 whitespace-nowrap">Ordenar por:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-700 text-white rounded-lg p-2 border border-purple-500 w-full sm:w-auto"
                >
                  <option value="id">ID</option>
                  <option value="priority">Prioridad (Alto primero)</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="text-gray-300 whitespace-nowrap">Filtrar Zona:</label>
                <select
                  value={techFilter}
                  onChange={(e) => setTechFilter(e.target.value)}
                  className="bg-gray-700 text-white rounded-lg p-2 border border-purple-500 w-full sm:w-auto"
                >
                  <option value="">Todas las Zonas</option>
                  {MUNICIPES.map((mun) => (
                    <option key={mun} value={mun}>
                      {mun}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-300 rounded-lg overflow-hidden">
                <thead className="text-xs uppercase bg-purple-900/50 text-orange-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Cliente / Tipo
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Zona
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Prioridad
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Técnico Asignado
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.map((order) => (
                    <tr key={order.id} className="bg-gray-700 border-b border-purple-700/50 hover:bg-gray-600">
                      <td className="px-6 py-4 font-mono text-purple-300">{order.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{order.client}</div>
                        <div className="text-xs text-gray-400">{order.type}</div>
                      </td>
                      <td className="px-6 py-4">{order.zone}</td>
                      <td
                        className={`px-6 py-4 font-bold ${order.priority === "Alto" ? "text-red-400" : order.priority === "Medio" ? "text-yellow-400" : "text-green-400"}`}
                      >
                        {order.priority}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {order.technician ? (
                          <span className="text-blue-400">{order.technician}</span>
                        ) : (
                          <select
                            onChange={(e) => handleAssignTech(order.id, e.target.value)}
                            className="bg-gray-800 text-white rounded-lg p-1 border border-orange-500"
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Asignar Técnico
                            </option>
                            {TECHNICIANS.map((tech) => (
                              <option key={tech} value={tech}>
                                {tech}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {order.status === "ASIGNADA" && (
                          <RetroButton color="blue" onClick={() => handleAssignTech(order.id, "")}>
                            Re-Asignar
                          </RetroButton>
                        )}
                        {order.status === "PENDIENTE" && <span className="text-gray-500">Esperando Asignación</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* 2. Estadísticas de Fallas por Zona */}
        <div className="lg:col-span-1">
          <Card title="Estadísticas de Fallas por Zona" icon={BarChart3} className="h-full">
            <p className="text-gray-400 mb-4 text-sm">
              Identificación de zonas críticas para análisis de patrones de falla.
            </p>
            <div className="space-y-4">
              {zoneStats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin
                        className={`w-5 h-5 flex-shrink-0 ${stat.count > 1 ? "text-orange-500" : "text-purple-400"}`}
                      />
                      <div className="text-white font-semibold text-sm">{stat.zone}</div>
                    </div>
                    <div className="text-sm font-mono whitespace-nowrap ml-2" style={{ color: stat.color }}>
                      {stat.count} Fallas
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 h-2 rounded-full">
                    <div
                      style={{
                        width: `${(stat.count / Math.max(...zoneStats.map((s) => s.count))) * 100}%`,
                        backgroundColor: stat.color,
                        boxShadow: `0 0 5px ${stat.color}`,
                      }}
                      className="h-2 rounded-full transition-all duration-500"
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// --- Componente Principal (App) ---

const App = () => {
  const [view, setView] = useState("planes") // 'planes', 'reporte', 'admin'
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState("login") // 'login' or 'register'
  const [authForm, setAuthForm] = useState({ username: "", password: "", confirmPassword: "" })
  const [authError, setAuthError] = useState("")

  const [users, setUsers] = useState([
    { username: "admin", password: "admin123" },
    { username: "usuario", password: "pass123" },
  ])

  const handleLogin = (e) => {
    e.preventDefault()
    setAuthError("")

    const user = users.find((u) => u.username === authForm.username && u.password === authForm.password)

    if (user) {
      setIsLoggedIn(true)
      setUsername(authForm.username)
      setShowAuthModal(false)
      setAuthForm({ username: "", password: "", confirmPassword: "" })
    } else {
      setAuthError("Usuario o contraseña incorrectos")
    }
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setAuthError("")

    if (authForm.password !== authForm.confirmPassword) {
      setAuthError("Las contraseñas no coinciden")
      return
    }

    if (authForm.password.length < 6) {
      setAuthError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    const userExists = users.find((u) => u.username === authForm.username)

    if (userExists) {
      setAuthError("El nombre de usuario ya está registrado")
      return
    }

    // Add new user
    setUsers([...users, { username: authForm.username, password: authForm.password }])
    setIsLoggedIn(true)
    setUsername(authForm.username)
    setShowAuthModal(false)
    setAuthForm({ username: "", password: "", confirmPassword: "" })
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername("")
  }

  const getNavButtonClass = (target) =>
    `px-6 py-3 font-bold uppercase transition-colors duration-200 
        ${
          view === target
            ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(138,43,226,1)] border-b-4 border-orange-400"
            : "text-gray-300 hover:bg-gray-700/50 border-b-4 border-transparent"
        }`

  const renderView = () => {
    if (view === "planes") return <PlanesView />
    if (view === "reporte") return <ReporteClienteView setView={setView} />
    if (view === "admin") return <AdminView />
    return <div className="text-white">Vista no encontrada.</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100" style={{ fontFamily: "Inter, sans-serif" }}>
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border-2 border-purple-500 shadow-[0_0_30px_rgba(138,43,226,0.8)] max-w-md w-full p-8 relative">
            <button
              onClick={() => {
                setShowAuthModal(false)
                setAuthError("")
                setAuthForm({ username: "", password: "", confirmPassword: "" })
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-6 text-center uppercase tracking-widest">
              {authMode === "login" ? "Iniciar Sesión" : "Registrarse"}
            </h2>

            {authError && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
                {authError}
              </div>
            )}

            <form onSubmit={authMode === "login" ? handleLogin : handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nombre de Usuario</label>
                <input
                  type="text"
                  value={authForm.username}
                  onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                  className="w-full p-3 bg-gray-700 border border-purple-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
                  required
                  minLength={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full p-3 bg-gray-700 border border-purple-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
                  required
                  minLength={6}
                />
              </div>

              {authMode === "register" && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirmar Contraseña</label>
                  <input
                    type="password"
                    value={authForm.confirmPassword}
                    onChange={(e) => setAuthForm({ ...authForm, confirmPassword: e.target.value })}
                    className="w-full p-3 bg-gray-700 border border-purple-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
                    required
                    minLength={6}
                  />
                </div>
              )}

              <RetroButton color="blue" type="submit">
                {authMode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
              </RetroButton>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setAuthMode(authMode === "login" ? "register" : "login")
                  setAuthError("")
                  setAuthForm({ username: "", password: "", confirmPassword: "" })
                }}
                className="text-sm text-purple-400 hover:text-purple-300 underline"
              >
                {authMode === "login" ? "¿No tienes cuenta? Regístrate aquí" : "¿Ya tienes cuenta? Inicia sesión"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Encabezado y Navegación */}
      <header className="bg-gray-800/80 backdrop-blur-sm shadow-xl sticky top-0 z-10 border-b border-blue-500/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Logo Section - Centered on mobile, left-aligned on desktop */}
          <div className="flex justify-center md:justify-start mb-4 md:mb-0">
            <Image
              src="/wavelink-logo.png"
              alt="WaveLink - Conexión del Futuro"
              width={200}
              height={80}
              className="h-12 w-auto md:h-16"
              priority
            />
          </div>

          {/* Navigation and Auth Section */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            {/* Navigation Buttons */}
            <div className="flex flex-col md:flex-row gap-2 md:space-x-2">
              <button className={getNavButtonClass("planes")} onClick={() => setView("planes")}>
                <Zap className="inline-block w-4 h-4 mr-2" /> Planes y Calidad
              </button>
              <button className={getNavButtonClass("reporte")} onClick={() => setView("reporte")}>
                <AlertTriangle className="inline-block w-4 h-4 mr-2" /> Reporte / Instalación
              </button>
              <button className={getNavButtonClass("admin")} onClick={() => setView("admin")}>
                <Settings className="inline-block w-4 h-4 mr-2" /> Gestión de Ordenes de servicio
              </button>
            </div>

            <div className="flex items-center justify-center md:justify-end space-x-4">
              <span className={`text-sm font-semibold ${isLoggedIn ? "text-green-400" : "text-red-400"}`}>
                {isLoggedIn ? `Bienvenido, ${username}` : "Invitado"}
              </span>
              <RetroButton
                color={isLoggedIn ? "orange" : "blue"}
                onClick={() => (isLoggedIn ? handleLogout() : setShowAuthModal(true))}
              >
                {isLoggedIn ? "Cerrar Sesión" : "Iniciar Sesión"}
              </RetroButton>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">{renderView()}</main>
    </div>
  )
}

export default App
