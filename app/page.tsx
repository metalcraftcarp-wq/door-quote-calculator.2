"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DoorClosed, SquareStack, Maximize } from "lucide-react"

export default function Home() {
  const router = useRouter()

  const opciones = [
    {
      id: "puertas",
      titulo: "Cotizar Puertas",
      descripcion: "Calcula presupuestos para puertas de aluminio línea Herrero",
      icon: DoorClosed,
      href: "/puertas",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      id: "ventanas",
      titulo: "Cotizar Ventanas",
      descripcion: "Presupuestos para ventanas de aluminio",
      icon: SquareStack,
      href: "/ventanas",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      id: "puertas-balcon",
      titulo: "Cotizar Puertas Balcón",
      descripcion: "Presupuestos para puertas balcón de aluminio",
      icon: Maximize,
      href: "/puertas-balcon",
      color: "bg-purple-500 hover:bg-purple-600",
    },
  ]

  return (
    <main className="min-h-svh bg-gradient-to-b from-background to-background/80">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
            <DoorClosed className="size-5 text-primary" />
            <span className="text-sm font-medium text-primary">WALUM</span>
          </div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Cotizador de Productos
          </h1>
          <p className="text-lg text-muted-foreground">
            Selecciona el tipo de producto que deseas cotizar
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {opciones.map((opcion) => {
            const Icon = opcion.icon
            return (
              <button
                key={opcion.id}
                onClick={() => router.push(opcion.href)}
                className="group relative overflow-hidden rounded-xl bg-card p-8 text-left shadow-sm transition-all hover:shadow-lg hover:scale-105 border border-border hover:border-primary/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="relative z-10 flex h-full flex-col gap-4">
                  <div
                    className={`inline-flex w-fit items-center justify-center rounded-lg p-3 ${opcion.color} text-white transition-transform group-hover:scale-110`}
                  >
                    <Icon className="size-6" />
                  </div>

                  <div className="flex flex-col gap-2 flex-1">
                    <h2 className="text-xl font-bold text-foreground">
                      {opcion.titulo}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {opcion.descripcion}
                    </p>
                  </div>

                  <div className="inline-flex items-center text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
                    Continuar →
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-16 rounded-lg bg-card border border-border p-6 sm:p-8">
          <h3 className="mb-3 text-lg font-bold text-foreground">
            Acerca del cotizador
          </h3>
          <p className="text-sm text-muted-foreground">
            WALUM Cotizador es una herramienta de presupuestación que te permite calcular costos de materiales, accesorios y ganancia de forma rápida y sencilla. Genera presupuestos profesionales que puedes imprimir o exportar en formato PDF.
          </p>
        </div>
      </div>
    </main>
  )
}
