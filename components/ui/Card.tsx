import React from "react"
import { LucideIcon } from "lucide-react"

interface CardProps {
  children: React.ReactNode
  title: string
  icon?: LucideIcon
  className?: string
}

export const Card = ({ children, title, icon: Icon, className = "" }: CardProps) => (
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
