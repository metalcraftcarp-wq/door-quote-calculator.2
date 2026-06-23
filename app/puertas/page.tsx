"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CamposCotizador } from "@/components/campos-cotizador"
import { ResultadoPresupuesto } from "@/components/resultado-presupuesto"
import { BocetoPuerta } from "@/components/boceto-puerta"
import {
  calcular,
  VALORES_INICIALES,
  type Parametros,
} from "@/lib/cotizador"
import { Printer, RotateCcw, DoorClosed, Save, FileText, Home } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export default function Page() {
  const router = useRouter()
  const [valores, setValores] = useState<Parametros>(VALORES_INICIALES)
  const [cliente, setCliente] = useState("")
  const [mostrarClienteView, setMostrarClienteView] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState("")

  const resultado = useMemo(() => {
    const seguro = Object.fromEntries(
      Object.entries(valores).map(([k, v]) => [k, Number.isNaN(v) ? 0 : v]),
    ) as Parametros
    return calcular(seguro)
  }, [valores])

  const fecha = useMemo(
    () =>
      new Date().toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    [],
  )

  function handleChange(key: keyof Parametros, value: number) {
    setValores((prev) => ({ ...prev, [key]: value }))
  }

  function reset() {
    setValores(VALORES_INICIALES)
    setCliente("")
  }

  async function guardarCotizacion() {
    if (!cliente.trim()) {
      setMensaje("Por favor ingresa el nombre del cliente")
      setTimeout(() => setMensaje(""), 3000)
      return
    }

    setGuardando(true)
    setMensaje("")
    try {
      const nuevaCotizacion = {
        id: Math.random().toString(36).substr(2, 9),
        nombreCliente: cliente.trim(),
        fechaCreacion: new Date().toISOString(),
        presupuestoAdministrativo: {
          ...resultado,
          cliente,
          fecha,
        },
        presupuestoCliente: {
          total: resultado.total,
          cliente,
          fecha,
        },
        parametros: valores,
      }

      // Guardar en localStorage primero (como backup)
      const cotizacionesLocal = localStorage.getItem("cotizaciones") || "[]"
      const cotizacionesGuardadas = JSON.parse(cotizacionesLocal)
      cotizacionesGuardadas.push(nuevaCotizacion)
      localStorage.setItem("cotizaciones", JSON.stringify(cotizacionesGuardadas))

      // Intentar guardar en servidor también
      try {
        await fetch("/api/cotizaciones/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevaCotizacion),
        })
      } catch (serverError) {
        console.warn("Error al guardar en servidor, pero se guardó en localStorage", serverError)
      }

      setMensaje(`Cotización guardada para ${cliente}`)
      setTimeout(() => setMensaje(""), 3000)
    } catch (error) {
      console.error("Error:", error)
      setMensaje("Error al guardar la cotización")
      setTimeout(() => setMensaje(""), 3000)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <main className="min-h-svh bg-background">
      <header className="no-print border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary-foreground/10">
              <DoorClosed className="size-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold leading-tight tracking-tight">
                WALUM · Cotizador
              </h1>
              <p className="text-sm text-primary-foreground/70">
                Puertas de aluminio · Línea Herrero
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => router.push("/")}
              className="gap-2"
            >
              <Home className="size-4" />
              Inicio
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push("/cotizaciones")}
              className="gap-2"
            >
              <FileText className="size-4" />
              Presupuestos
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_420px]">
        {mensaje && (
          <div className={`col-span-full rounded-lg border p-4 ${
            mensaje.includes("Error") 
              ? "border-red-200 bg-red-50 text-red-800" 
              : "border-green-200 bg-green-50 text-green-800"
          }`}>
            {mensaje}
          </div>
        )}
        <section className="no-print flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cliente">Cliente / Referencia</Label>
            <Input
              id="cliente"
              placeholder="Ej: Juan Pérez - Puerta exterior"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
            />
          </div>

          <CamposCotizador valores={valores} onChange={handleChange} />

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => window.print()} className="gap-2">
              <Printer className="size-4" />
              Imprimir / Exportar PDF
            </Button>
            <Button 
              onClick={guardarCotizacion} 
              variant="default"
              className="gap-2"
              disabled={guardando}
            >
              <Save className="size-4" />
              {guardando ? "Guardando..." : "Guardar Cotización"}
            </Button>
            <Button variant="outline" onClick={reset} className="gap-2">
              <RotateCcw className="size-4" />
              Restablecer
            </Button>
          </div>
        </section>

        <aside className="lg:sticky lg:top-6 lg:self-start flex flex-col gap-6">
          <div className="no-print flex items-center justify-between rounded-lg border border-border bg-card p-4">
            <div className="flex flex-col gap-1">
              <Label className="text-sm font-medium">
                {mostrarClienteView ? "Presupuesto Para Cliente" : "Presupuesto Administrativo"}
              </Label>
              <p className="text-xs text-muted-foreground">
                {mostrarClienteView ? "Solo precio final visible" : "Todos los detalles"}
              </p>
            </div>
            <Switch
              checked={mostrarClienteView}
              onCheckedChange={setMostrarClienteView}
            />
          </div>

          {!mostrarClienteView && (
            <>
              <ResultadoPresupuesto
                resultado={resultado}
                parametros={valores}
                cliente={cliente}
                fecha={fecha}
                esCliente={false}
              />
              <BocetoPuerta resultado={resultado} parametros={valores} />
            </>
          )}

          {mostrarClienteView && (
            <>
              <ResultadoPresupuesto
                resultado={resultado}
                parametros={valores}
                cliente={cliente}
                fecha={fecha}
                esCliente={true}
              />
              <BocetoPuerta resultado={resultado} parametros={valores} />
            </>
          )}

          <div className="hidden print:block print:page-break-before">
            <ResultadoPresupuesto
              resultado={resultado}
              parametros={valores}
              cliente={cliente}
              fecha={fecha}
              esCliente={false}
            />
            <div className="mt-6">
              <BocetoPuerta resultado={resultado} parametros={valores} />
            </div>
          </div>

          <div className="hidden print:block">
            <ResultadoPresupuesto
              resultado={resultado}
              parametros={valores}
              cliente={cliente}
              fecha={fecha}
              esCliente={true}
            />
          </div>
        </aside>
      </div>
    </main>
  )
}
