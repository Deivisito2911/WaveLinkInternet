import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Order } from "@/data/mock-data"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateZoneStats = (orders: Order[]) => {
  const counts = orders.reduce((acc, order) => {
    acc[order.zone] = (acc[order.zone] || 0) + (order.status === "PENDIENTE" || order.status === "ASIGNADA" ? 1 : 0)
    return acc
  }, {} as Record<string, number>)

  return Object.keys(counts)
    .map((zone) => ({
      zone,
      count: counts[zone],
      color: counts[zone] > 1 ? "#FFA500" : "#8A2BE2",
    }))
    .sort((a, b) => b.count - a.count)
}
