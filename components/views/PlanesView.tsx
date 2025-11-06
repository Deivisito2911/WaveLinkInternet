// components/views/PlanesView.tsx
"use client"
import React, { useState, useEffect } from "react" // <-- 1. AÑADE useEffect
import { Zap, TrendingUp, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { RetroButton } from "@/components/ui/RetroButton"
import { supabase } from "@/lib/supabaseClient" // <-- 3. IMPORTA supabase

// 4. DEFINE LOS TIPOS (opcional pero recomendado)
type Plan = {
  id: number;
  name: string;
  speed: number;
  price: number;
  features: string[];
  color: string;
  border: string;
}
type Promotion = {
  id: number;
  name: string;
  discount: string;
  date: string;
  color: string;
}

export const PlanesView = () => {
  // 5. CREA ESTADOS PARA LOS DATOS
  const [plans, setPlans] = useState<Plan[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])

  const [rating, setRating] = useState(5)
  const [comments, setComments] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [qualityMessage, setQualityMessage] = useState<string | null>(null)

  // 6. AÑADE useEffect PARA CARGAR DATOS
  useEffect(() => {
    const fetchData = async () => {
      // Carga planes y promociones en paralelo
      const [plansRes, promosRes] = await Promise.all([
        supabase
          .from("plans")
          .select("*")
          .order("speed", { ascending: true }), // Ordenar por velocidad
        
        supabase.from("promotions").select("*")
      ])

      if (plansRes.data) setPlans(plansRes.data)
      if (promosRes.data) setPromotions(promosRes.data)
    }
    
    fetchData()
  }, []) // El array vacío asegura que se ejecute solo una vez

  // 7. MODIFICA handleQualitySubmit PARA GUARDAR DATOS
  const handleQualitySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase
      .from("quality_feedback")
      .insert({
        rating: rating,
        comments: comments,
        is_anonymous: isAnonymous
      })

    if (error) {
      setQualityMessage(`❌ Error al enviar: ${error.message}`)
    } else {
      setQualityMessage("✅ ¡Feedback enviado! Gracias por ayudarnos a mejorar nuestros .")
      setRating(5)
      setComments("")
      setIsAnonymous(false)
      setTimeout(() => setQualityMessage(null), 5000)
    }
  }

  return (
    <div className="space-y-10">
      <Card title="Planes de Servicio WaveLink" icon={Zap} className="bg-gray-900/50">
        <p className="text-gray-300 mb-6">Conéctate a la velocidad del futuro con nuestros planes de fibra óptica.</p>

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
                width: 200%;
                animation: marquee 20s linear infinite;
              }
            `}</style>
            {[...promotions, ...promotions].map((promo, index) => (
              <span key={index} className={`flex-shrink-0 text-lg font-extrabold ${promo.color} tracking-wider mr-8`}>
                ⚡ {promo.name}: {promo.discount} OFF en {promo.date}! ⚡
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
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
