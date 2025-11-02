"use client"

import { useState, useEffect } from "react" // Importa useEffect
import { Zap, Settings, AlertTriangle } from "lucide-react"
import Image from "next/image"

// Importa tus vistas y componentes
import { PlanesView } from "@/components/views/PlanesView"
import { ReporteClienteView } from "@/components/views/ReporteClienteView"
import { AdminView } from "@/components/views/AdminView"
import { AuthModal } from "@/components/auth/AuthModal"
import { RetroButton } from "@/components/ui/RetroButton"
import { supabase } from "@/lib/supabaseClient" // <-- 1. IMPORTAR SUPABASE

export default function Home() {
  const [view, setView] = useState("planes")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [userRole, setUserRole] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    phone: "",
  }) // <-- CAMBIA username por email
  const [authError, setAuthError] = useState("")

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        setIsLoggedIn(true)
        // Ahora, además de la sesión, busca el perfil
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, role")
          .eq("id", session.user.id)
          .single() // .single() trae un solo objeto en lugar de un array
        
        if (profile) {
          setUsername(profile.username || session.user.email)
          setUserRole(profile.role) // <-- Guarda el rol
        }
      }
    }
    
    fetchSessionAndProfile()

    // El listener se actualiza para hacer lo mismo
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          setIsLoggedIn(true)
          const { data: profile } = await supabase
            .from("profiles")
            .select("username, role")
            .eq("id", session.user.id)
            .single()
            
          if (profile) {
            setUsername(profile.username || session.user.email)
            setUserRole(profile.role)
          }
        }
        if (event === "SIGNED_OUT") {
          setIsLoggedIn(false)
          setUsername("")
          setUserRole(null) // <-- Limpia el rol al salir
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    
    const { error } = await supabase.auth.signInWithPassword({
      email: authForm.email,
      password: authForm.password,
    })

    if (error) {
      setAuthError(error.message)
    } else {
      setShowAuthModal(false)
      cleanAuthModal()
      // El listener de 'onAuthStateChange' se encargará de poner isLoggedIn = true
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
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

    const { error } = await supabase.auth.signUp({
      email: authForm.email,
      password: authForm.password,
      options: {
        data: {
          first_name: authForm.first_name,
          last_name: authForm.last_name,
          phone: authForm.phone,
        },
      },
    })

    if (error) {
      setAuthError(error.message)
    } else {
      // Supabase te envía un email de confirmación (puedes desactivarlo)
      alert("¡Registro exitoso! Revisa tu email para confirmar.")
      setShowAuthModal(false)
      cleanAuthModal()
    }
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error al cerrar sesión:", error)
    }
    // El listener de 'onAuthStateChange' se encargará de poner isLoggedIn = false
  }

  const cleanAuthModal = () => {
    setAuthError("")
    setAuthForm({
      email: "",
      password: "",
      confirmPassword: "",
      first_name: "",
      last_name: "",
      phone: "",
    })
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
              {isLoggedIn && userRole === 'admin' && (
                <button className={getNavButtonClass("admin")} onClick={() => setView("admin")}>
                  <Settings className="inline-block w-4 h-4 mr-2" /> Gestión de Ordenes de servicio
                </button>
              )}
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
