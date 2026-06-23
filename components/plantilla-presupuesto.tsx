"use client"

import { MapPin, Phone, Mail, Globe } from "lucide-react"
import { moneda } from "@/lib/cotizador"

export type LineaPresupuesto = {
  descripcion: string
  cantidad: number
  precioUnitario: number
  precioTotal: number
}

export type DatosPresupuesto = {
  numero: string
  fecha: string
  validoHasta: string
  asesor: string
  cliente: string
  telefono: string
  direccion: string
  items: LineaPresupuesto[]
  total: number
  observaciones: string
}

const EMPRESA = {
  nombre: "WALUM - Aberturas en Aluminio",
  direccion: "Pasaje Mármol 2436, Resistencia Chaco",
  email: "contacto@walum.com.ar",
  web: "www.walum.com.ar",
  telefono: "3624-7448-35",
}

// Asegura colores de marca al imprimir / exportar a PDF
const printColor = {
  WebkitPrintColorAdjust: "exact",
  printColorAdjust: "exact",
} as React.CSSProperties

function CampoLinea({ label, valor }: { label: string; valor?: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-[13px] text-foreground">{label}</span>
      <span className="min-w-0 flex-1 border-b border-foreground/30 pb-0.5 text-[13px] font-medium text-foreground">
        {valor || "\u00A0"}
      </span>
    </div>
  )
}

export function PlantillaPresupuesto({
  datos,
  id,
}: {
  datos: DatosPresupuesto
  id?: string
}) {
  const filasMinimas = 8
  const filasVacias = Math.max(0, filasMinimas - datos.items.length)

  return (
    <div
      id={id}
      className="relative mx-auto flex w-full max-w-[210mm] flex-col rounded-lg border border-border bg-white px-8 py-8 text-foreground shadow-sm print:rounded-none print:border-0 print:shadow-none"
    >
      {/* Marca de agua */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span className="select-none text-[64px] font-extrabold uppercase tracking-widest text-primary/[0.04]">
          WALUM
        </span>
      </div>

      {/* Encabezado */}
      <header className="relative flex items-start justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <span className="text-3xl font-extrabold leading-none tracking-tight text-primary">
              WALUM
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">
              Aberturas en Aluminio
            </span>
          </div>
          <div className="flex flex-col gap-1.5 pt-1">
            <p className="text-sm font-bold text-foreground">{EMPRESA.nombre}</p>
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
              <MapPin className="size-3.5 text-primary" />
              <span>{EMPRESA.direccion}</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
              <Mail className="size-3.5 text-primary" />
              <span>Email: {EMPRESA.email}</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
              <Globe className="size-3.5 text-primary" />
              <span>Sitio web: {EMPRESA.web}</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
              <Phone className="size-3.5 text-primary" />
              <span>{EMPRESA.telefono}</span>
            </div>
          </div>
        </div>

        <div className="flex w-[260px] flex-col gap-3">
          <div className="border-b-2 border-primary pb-1 text-right">
            <span className="text-xl font-light uppercase tracking-[0.3em] text-foreground">
              Presupuesto
            </span>
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <CampoLinea label="Fecha:" valor={datos.fecha} />
            <CampoLinea label="Número:" valor={datos.numero} />
            <CampoLinea label="Válido hasta:" valor={datos.validoHasta} />
            <CampoLinea label="Asesor:" valor={datos.asesor} />
          </div>
        </div>
      </header>

      {/* Datos del cliente */}
      <section
        className="relative mt-6 rounded-md bg-secondary px-5 py-4"
        style={printColor}
      >
        <p className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">
          Datos del Cliente
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CampoLinea label="Nombre:" valor={datos.cliente} />
          <CampoLinea label="Teléfono:" valor={datos.telefono} />
          <CampoLinea label="Dirección:" valor={datos.direccion} />
        </div>
      </section>

      {/* Tabla de productos */}
      <section className="relative mt-5">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-primary text-primary-foreground" style={printColor}>
              <th className="border border-primary px-3 py-2.5 text-left text-[12px] font-bold uppercase tracking-wide">
                Descripción del Producto
              </th>
              <th className="w-[80px] border border-primary px-2 py-2.5 text-center text-[12px] font-bold uppercase tracking-wide">
                Cantidad
              </th>
              <th className="w-[120px] border border-primary px-2 py-2.5 text-center text-[12px] font-bold uppercase tracking-wide">
                Precio Unitario
              </th>
              <th className="w-[120px] border border-primary px-2 py-2.5 text-center text-[12px] font-bold uppercase tracking-wide">
                Precio Total
              </th>
            </tr>
          </thead>
          <tbody>
            {datos.items.map((item, i) => (
              <tr key={i}>
                <td className="border border-border px-3 py-2.5 align-top text-[13px] text-foreground">
                  {item.descripcion}
                </td>
                <td className="border border-border px-2 py-2.5 text-center align-top text-[13px] text-foreground">
                  {item.cantidad}
                </td>
                <td className="border border-border px-2 py-2.5 text-right align-top font-mono text-[13px] tabular-nums text-foreground">
                  {moneda(item.precioUnitario)}
                </td>
                <td className="border border-border px-2 py-2.5 text-right align-top font-mono text-[13px] tabular-nums text-foreground">
                  {moneda(item.precioTotal)}
                </td>
              </tr>
            ))}
            {Array.from({ length: filasVacias }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td className="border border-border px-3 py-2.5 text-[13px]">&nbsp;</td>
                <td className="border border-border px-2 py-2.5" />
                <td className="border border-border px-2 py-2.5" />
                <td className="border border-border px-2 py-2.5" />
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Total */}
      <section className="relative mt-4 flex items-stretch justify-end gap-0">
        <div
          className="flex items-center rounded-l-md bg-secondary px-6"
          style={printColor}
        >
          <span className="text-sm font-bold uppercase tracking-wide text-primary">
            Total
          </span>
        </div>
        <div className="flex min-w-[200px] items-center justify-end rounded-r-md border-2 border-primary px-5 py-3">
          <span className="font-mono text-xl font-bold tabular-nums text-foreground">
            {moneda(datos.total)}
          </span>
        </div>
      </section>

      {/* Observaciones */}
      <section className="relative mt-6">
        <p className="text-[13px] text-foreground">Observaciones:</p>
        <div className="mt-2 flex flex-col gap-3">
          {datos.observaciones ? (
            <p className="whitespace-pre-line border-b border-foreground/20 pb-1 text-[13px] text-muted-foreground">
              {datos.observaciones}
            </p>
          ) : (
            <>
              <div className="border-b border-foreground/20 pb-3" />
              <div className="border-b border-foreground/20 pb-3" />
              <div className="border-b border-foreground/20 pb-3" />
            </>
          )}
        </div>
      </section>

      {/* Pie de página */}
      <footer
        className="relative mt-8 border-t-2 border-primary pt-4"
        style={printColor}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span
              className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground"
              style={printColor}
            >
              <MapPin className="size-3.5" />
            </span>
            <span className="text-[11px] leading-tight text-muted-foreground">
              Pasaje Mármol 2436,
              <br />
              Resistencia Chaco
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground"
              style={printColor}
            >
              <Phone className="size-3.5" />
            </span>
            <span className="text-[11px] text-muted-foreground">{EMPRESA.telefono}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground"
              style={printColor}
            >
              <Mail className="size-3.5" />
            </span>
            <span className="text-[11px] text-muted-foreground">{EMPRESA.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground"
              style={printColor}
            >
              <Globe className="size-3.5" />
            </span>
            <span className="text-[11px] text-muted-foreground">{EMPRESA.web}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
