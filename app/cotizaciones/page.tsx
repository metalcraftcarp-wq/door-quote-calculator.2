"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DoorClosed, ChevronRight } from "lucide-react"

type Cotizacion = {
  id: string
  nombreCliente: string
  fechaCreacion: string
  presupuestoAdministrativo: Record<string, unknown>
}

type CotizacionesAgrupadas = Record<string, Cotizacion[]>

export default function CotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState<CotizacionesAgrupadas>({})
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function cargarCotizaciones() {
      try {
        const response = await fetch("/api/cotizaciones/list")
        if (!response.ok) throw new Error("Error al cargar cotizaciones")
        const data = await response.json()
        
        // Si el servidor devuelve datos vacíos, intenta con localStorage
        if (Object.keys(data).length === 0) {
          const cotizacionesLocal = localStorage.getItem("cotizaciones")
          if (cotizacionesLocal) {
            try {
              const cotizacionesGuardadas = JSON.parse(cotizacionesLocal)
              const agrupadas = cotizacionesGuardadas.reduce(
                (acc: Record<string, Cotizacion[]>, cotizacion: Cotizacion) => {
                  const cliente = cotizacion.nombreCliente
                  if (!acc[cliente]) {
                    acc[cliente] = []
                  }
                  acc[cliente].push(cotizacion)
                  return acc
                },
                {}
              )
              setCotizaciones(agrupadas)
              setCargando(false)
              return
            } catch (e) {
              console.warn("Error parsing localStorage:", e)
            }
          }
        }
        
        setCotizaciones(data)
      } catch (err) {
        setError("Error al cargar las cotizaciones")
        console.error(err)
      } finally {
        setCargando(false)
      }
    }

    cargarCotizaciones()
  }, [])

  if (cargando) {
    return (
      <div className="min-h-svh bg-background">
        <header className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-5 sm:px-6">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary-foreground/10">
              <DoorClosed className="size-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold leading-tight tracking-tight">
                Cotizaciones Guardadas
              </h1>
              <p className="text-sm text-primary-foreground/70">
                Historial de presupuestos
              </p>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <p className="text-center text-muted-foreground">Cargando cotizaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-5 sm:px-6">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary-foreground/10">
            <DoorClosed className="size-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold leading-tight tracking-tight">
              Cotizaciones Guardadas
            </h1>
            <p className="text-sm text-primary-foreground/70">
              Historial de presupuestos por cliente
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link href="/" className="mb-6 inline-block">
          <Button variant="outline" className="gap-2">
            ← Volver al cotizador
          </Button>
        </Link>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        {Object.keys(cotizaciones).length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              No hay cotizaciones guardadas. Crea una en el cotizador.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {Object.entries(cotizaciones).map(([cliente, items]) => (
              <div key={cliente} className="rounded-lg border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  {cliente}
                </h2>
                <div className="space-y-2">
                  {items.map((cotizacion) => (
                    <Link
                      key={cotizacion.id}
                      href={`/cotizaciones/${cotizacion.id}`}
                      className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-accent"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {new Date(cotizacion.fechaCreacion).toLocaleDateString(
                            "es-AR"
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(cotizacion.fechaCreacion).toLocaleTimeString(
                            "es-AR"
                          )}
                        </span>
                      </div>
                      <ChevronRight className="size-5 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
