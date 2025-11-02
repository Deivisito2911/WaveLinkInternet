// components/views/AdminView.tsx
"use client"
import React, { useState, useMemo, useCallback, useEffect } from "react" // 1. Importa useEffect
import { Settings, MapPin, BarChart3 } from "lucide-react"
import { MUNICIPES, TECHNICIANS, Order } from "@/data/mock-data" // 2. BORRA INITIAL_ORDERS
import { generateZoneStats } from "@/lib/utils"
import { Card } from "@/components/ui/Card"
import { RetroButton } from "@/components/ui/RetroButton"
import { supabase } from "@/lib/supabaseClient" // 1. Importa supabase

export const AdminView = () => {
  // 3. Inicializa 'orders' como un array vacío
  const [orders, setOrders] = useState<Order[]>([])
  const [sortBy, setSortBy] = useState("id")
  const [techFilter, setTechFilter] = useState("")

  // 4. AÑADE useEffect para cargar datos
  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders") // El nombre de tu tabla
      .select("*")   // Trae todas las columnas
    
    if (error) {
      console.error("Error cargando órdenes:", error)
    } else if (data) {
      setOrders(data)
    }
  }

  const zoneStats = useMemo(() => generateZoneStats(orders), [orders])

  const sortedOrders = useMemo(() => {
    let filtered = orders
    if (techFilter) {
      filtered = orders.filter((o) => o.zone === techFilter)
    }

    return filtered.sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = { Alto: 3, Medio: 2, Bajo: 1 }
        return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
      }
      return a.id - b.id
    })
  }, [orders, sortBy, techFilter])

  const handleAssignTech = useCallback(async (id: number, tech: string) => {
    const newStatus = tech ? "ASIGNADA" : "PENDIENTE"

    // 5a. Actualiza el estado local INMEDIATAMENTE (para UI rápida)
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, technician: tech, status: newStatus } : order)),
    )
    
    // 5b. Actualiza la base de datos en segundo plano
    const { error } = await supabase
      .from("orders")
      .update({ technician: tech, status: newStatus })
      .eq("id", id) // Dónde id = id

    if (error) {
      console.error("Error al asignar técnico:", error)
      // Opcional: Revertir el estado si falla
      fetchOrders() // Recarga los datos para asegurar consistencia
    }
  }, []) // El array de dependencias de useCallback sigue vacío

  const getStatusColor = (status: string) => {
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
                    <th scope="col" className="px-6 py-3">ID</th>
                    <th scope="col" className="px-6 py-3">Cliente / Tipo</th>
                    <th scope="col" className="px-6 py-3">Zona</th>
                    <th scope="col" className="px-6 py-3">Prioridad</th>
                    <th scope="col" className="px-6 py-3">Estado</th>
                    <th scope="col" className="px-6 py-3">Técnico Asignado</th>
                    <th scope="col" className="px-6 py-3">Acción</th>
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
                            <option value="" disabled>Asignar Técnico</option>
                            {TECHNICIANS.map((tech) => (
                              <option key={tech} value={tech}>{tech}</option>
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
