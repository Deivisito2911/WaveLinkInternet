import React from "react"

interface RetroButtonProps {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  color?: "purple" | "orange" | "blue"
  type?: "button" | "submit" | "reset"
}

export const RetroButton = ({ children, onClick, color = "purple", type = "button" }: RetroButtonProps) => {
  let baseColor = "bg-purple-600 hover:bg-purple-700 shadow-purple-900/50"
  if (color === "orange") baseColor = "bg-orange-600 hover:bg-orange-700 shadow-orange-900/50"
  if (color === "blue") baseColor = "bg-blue-600 hover:bg-blue-700 shadow-blue-900/50"

  return (
    <button
      onClick={onClick}
      type={type}
      className={`px-4 py-2 font-semibold text-white rounded-lg transition-all duration-150 transform hover:scale-[1.03] ${baseColor} shadow-lg border border-white/20`}
    >
      {children}
    </button>
  )
}
