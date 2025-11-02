"use client"

import { useState } from "react"
import { Zap, Settings, AlertTriangle } from "lucide-react"
import Image from "next/image"

// Importa tus vistas y componentes
import { PlanesView } from "@/components/views/PlanesView"
import { ReporteClienteView } from "@/components/views/ReporteClienteView"
import { AdminView } from "@/components/views/AdminView"
import { AuthModal } from "@/components/auth/AuthModal"
import { RetroButton } from "@/components/ui/RetroButton"

export default function Home() {
  const [view, setView] = useState("planes") // 'planes', 'reporte', 'admin'
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [authForm, setAuthForm] = useState({ username: "", password: "", confirmPassword: "" })
  const [authError, setAuthError] = useState("")

  const [users, setUsers] = useState([
    { username: "admin", password: "admin123" },
    { username: "usuario", password: "pass123" },
  ])

  const handleLogin = (e: React.FormEvent) => {
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

  const handleRegister = (e: React.FormEvent) => {
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

  const cleanAuthModal = () => {
    setAuthError("")
    setAuthForm({ username: "", password: "", confirmPassword: "" })
  }

  const getNavButtonClass = (target: string) =>
    `px-6 py-3 font-bold uppercase transition-colors duration-200 ${
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
        <AuthModal
          authMode={authMode}
          setAuthMode={setAuthMode}
          onClose={() => {
            setShowAuthModal(false)
            cleanAuthModal()
          }}
          authError={authError}
          setAuthError={setAuthError}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
          authForm={authForm}
          setAuthForm={setAuthForm}
        />
      )}

      <header className="bg-gray-800/80 backdrop-blur-sm shadow-xl sticky top-0 z-10 border-b border-blue-500/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">{renderView()}</main>
    </div>
  )
}
