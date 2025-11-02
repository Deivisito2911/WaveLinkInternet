import type React from "react"
import type { Metadata } from "next"
import { Geist} from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })

export const metadata: Metadata = {
  title: "WaveLink - Conexión del Futuro | Internet de Alta Velocidad",
  description:
    "WaveLink ofrece servicios de internet de alta velocidad con planes desde 50 Mbps. Sistema de órdenes de servicio para reportar fallas y solicitar instalaciones. Conexión del futuro.",
  keywords: [
    "WaveLink",
    "internet",
    "fibra óptica",
    "alta velocidad",
    "servicio técnico",
    "instalación internet",
    "reporte de fallas",
    "conexión del futuro",
  ],
  authors: [{ name: "WaveLink" }],
  creator: "WaveLink",
  publisher: "WaveLink",
  verification: {
    google: "rYtVHBnXCV0dF9mwbpREp0e-jCrJaf2gA5G2TK3sm7w",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://wavelinkconexiondelfuturo.vercel.app/",
    title: "WaveLink - Conexión del Futuro",
    description: "Servicios de internet de alta velocidad. Reporta fallas y solicita instalaciones fácilmente.",
    siteName: "WaveLink",
    images: [
      {
        url: "https://wavelinkconexiondelfuturo.vercel.app/wavelink-logo.png",
        width: 1200,
        height: 630,
        alt: "WaveLink Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WaveLink - Conexión del Futuro",
    description: "Servicios de internet de alta velocidad con soporte técnico 24/7",
    images: ["https://wavelinkconexiondelfuturo.vercel.app/wavelink-logo.png"],
  },
  metadataBase: new URL("https://wavelinkconexiondelfuturo.vercel.app"),
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geist.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
