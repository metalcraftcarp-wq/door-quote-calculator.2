"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DoorClosed, ChevronLeft, Download } from "lucide-react"
import { ResultadoPresupuesto } from "@/components/resultado-presupuesto"

type Cotizacion = {
  id: string
  nombreCliente: string
  fechaCreacion: string
  presupuestoAdministrativo: {
    total: number
    cliente: string
    fecha: string
  } & Record<string, unknown>
  presupuestoCliente: {
    total: number
    cliente: string
    fecha: string
  }
  parametros: Record<string, unknown>
}

interface PageProps {
  params: {
    id: string
  }
}

export default function CotizacionDetallePage({ params }: PageProps) {
  const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function cargarCotizacion() {
      try {
        // Primero intenta con localStorage (ya que es lo más directo)
        const cotizacionesLocal = localStorage.getItem("cotizaciones")
        if (cotizacionesLocal) {
          try {
            const cotizacionesGuardadas = JSON.parse(cotizacionesLocal)
            const cotizacionEncontrada = cotizacionesGuardadas.find((c: any) => c.id === params.id)
            if (cotizacionEncontrada) {
              setCotizacion(cotizacionEncontrada)
              setCargando(false)
              return
            }
          } catch (e) {
            console.warn("Error parsing localStorage:", e)
          }
        }
        
        // Si no está en localStorage, intenta con el servidor
        const response = await fetch(`/api/cotizaciones/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setCotizacion(data)
          setCargando(false)
          return
        }
        
        throw new Error("Cotización no encontrada")
      } catch (err) {
        setError("Error al cargar la cotización")
        console.error(err)
      } finally {
        setCargando(false)
      }
    }

    cargarCotizacion()
  }, [params.id])

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
                Cotización
              </h1>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <p className="text-center text-muted-foreground">Cargando cotización...</p>
        </div>
      </div>
    )
  }

  if (error || !cotizacion) {
    return (
      <div className="min-h-svh bg-background">
        <header className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-5 sm:px-6">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary-foreground/10">
              <DoorClosed className="size-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold leading-tight tracking-tight">
                Cotización
              </h1>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <Link href="/cotizaciones" className="mb-6 inline-block">
            <Button variant="outline" className="gap-2">
              <ChevronLeft className="size-4" />
              Volver
            </Button>
          </Link>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
          </div>
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
          <div className="flex-1">
            <h1 className="text-xl font-bold leading-tight tracking-tight">
              {cotizacion.nombreCliente}
            </h1>
            <p className="text-sm text-primary-foreground/70">
              {new Date(cotizacion.fechaCreacion).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <Button
            onClick={() => window.print()}
            className="gap-2"
            variant="secondary"
          >
            <Download className="size-4" />
            Descargar PDF
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link href="/cotizaciones" className="mb-6 inline-block">
          <Button variant="outline" className="gap-2">
            <ChevronLeft className="size-4" />
            Volver
          </Button>
        </Link>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-6 flex flex-col gap-2">
            <h2 className="text-lg font-semibold">Presupuesto Administrativo</h2>
            <p className="text-sm text-muted-foreground">
              Vista completa con todos los detalles
            </p>
          </div>

          <div id="presupuesto-print" className="no-print">
            {/* Mostrar presupuesto completo */}
            <div className="flex flex-col gap-4 rounded-lg border border-border p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-bold tracking-tight text-primary">
                    WALUM
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Aberturas de aluminio · Línea Herrero
                  </p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">
                    Presupuesto Administrativo
                  </p>
                  <p>
                    {new Date(cotizacion.fechaCreacion).toLocaleDateString(
                      "es-AR"
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div>
                  <span className="text-muted-foreground">Cliente: </span>
                  <span className="font-medium text-foreground">
                    {cotizacion.nombreCliente}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-lg bg-primary px-5 py-4 text-primary-foreground">
                <span className="text-sm font-medium uppercase tracking-wide">
                  Total
                </span>
                <span className="font-mono text-2xl font-bold tabular-nums">
                  ${(
                    cotizacion.presupuestoAdministrativo?.total ||
                    cotizacion.presupuestoCliente?.total ||
                    (cotizacion as any)?.total ||
                    0
                  ).toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <p className="pt-4 text-center text-[11px] text-muted-foreground">
                Presupuesto orientativo. Valores sujetos a confirmación. Validez 7
                días.
              </p>
            </div>
          </div>

          {/* Para impresi��n */}
          <div className="hidden print:block">
            <div id="presupuesto-cliente-print" className="flex flex-col gap-4 rounded-lg border border-border p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-bold tracking-tight text-primary">
                    WALUM
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Aberturas de aluminio · Línea Herrero
                  </p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">Presupuesto</p>
                  <p>
                    {new Date(cotizacion.fechaCreacion).toLocaleDateString(
                      "es-AR"
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div>
                  <span className="text-muted-foreground">Cliente: </span>
                  <span className="font-medium text-foreground">
                    {cotizacion.nombreCliente}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-lg bg-primary px-5 py-4 text-primary-foreground">
                <span className="text-sm font-medium uppercase tracking-wide">
                  Total
                </span>
                <span className="font-mono text-2xl font-bold tabular-nums">
                  ${cotizacion.presupuestoCliente.total?.toLocaleString(
                    "es-AR",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  ) || "0,00"}
                </span>
              </div>

              <p className="pt-4 text-center text-[11px] text-muted-foreground">
                Presupuesto orientativo. Valores sujetos a confirmación. Validez 7
                días.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
