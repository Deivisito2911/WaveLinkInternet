"use client"
import React, { useState } from "react"
import { Mail, Calendar, AlertTriangle } from "lucide-react"
import { MUNICIPES, INITIAL_ORDERS } from "@/data/mock-data"
import { Card } from "@/components/ui/Card"
import { RetroButton } from "@/components/ui/RetroButton"

interface ReporteClienteViewProps {
  setView: (view: string) => void
}

export const ReporteClienteView = ({ setView }: ReporteClienteViewProps) => {
  const [tickets, setTickets] = useState(INITIAL_ORDERS.filter((o) => o.client === "Carlos Pérez"))
  const [newTicket, setNewTicket] = useState({ problem: "", zone: MUNICIPES[0], date: "", type: "falla" })
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage(
      `Ticket #${Math.floor(Math.random() * 1000) + 200} creado con éxito para la zona de ${newTicket.zone}. Esté atento a su Historial de Tickets.`,
    )
    setTimeout(() => setSuccessMessage(null), 5000)
  }

  const isInstallation = newTicket.type === "instalacion"

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
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
                  rows={3}
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
