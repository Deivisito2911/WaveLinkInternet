"use client"
import React from "react"
import { X } from "lucide-react"
import { RetroButton } from "@/components/ui/RetroButton"

interface AuthModalProps {
  authMode: "login" | "register"
  setAuthMode: (mode: "login" | "register") => void
  onClose: () => void
  authError: string
  setAuthError: (error: string) => void
  handleLogin: (e: React.FormEvent) => void
  handleRegister: (e: React.FormEvent) => void
  authForm: any
  setAuthForm: (form: any) => void
}

export const AuthModal = ({
  authMode,
  setAuthMode,
  onClose,
  authError,
  setAuthError,
  handleLogin,
  handleRegister,
  authForm,
  setAuthForm,
}: AuthModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border-2 border-purple-500 shadow-[0_0_30px_rgba(138,43,226,0.8)] max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
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
  )
}
