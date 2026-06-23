"use client"

import { Separator } from "@/components/ui/separator"
import { moneda, type Parametros, type Resultado } from "@/lib/cotizador"

type Props = {
  resultado: Resultado
  parametros: Parametros
  cliente: string
  fecha: string
  esCliente?: boolean
}

function Fila({
  label,
  valor,
  detalle,
  mostrarValor = true,
}: {
  label: string
  valor: string
  detalle?: string
  mostrarValor?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <div className="flex flex-col">
        <span className="text-sm text-foreground">{label}</span>
        {detalle ? (
          <span className="text-xs text-muted-foreground">{detalle}</span>
        ) : null}
      </div>
      {mostrarValor && (
        <span className="font-mono text-sm font-medium tabular-nums text-foreground">
          {valor}
        </span>
      )}
    </div>
  )
}

export function ResultadoPresupuesto({
  resultado: r,
  parametros: p,
  cliente,
  fecha,
  esCliente = false,
}: Props) {
  return (
    <div
      id={esCliente ? "presupuesto-cliente-print" : "presupuesto-print"}
      className="flex flex-col rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="text-xl font-bold tracking-tight text-primary">WALUM</p>
          <p className="text-xs text-muted-foreground">
            Aberturas de aluminio · Línea Herrero
          </p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <p className="font-medium text-foreground">
            {esCliente ? "Presupuesto" : "Presupuesto Administrativo"}
          </p>
          <p>{fecha}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 py-4 text-sm">
        <div>
          <span className="text-muted-foreground">Cliente: </span>
          <span className="font-medium text-foreground">
            {cliente.trim() || "—"}
          </span>
        </div>
        <div className="text-right">
          <span className="text-muted-foreground">Medida: </span>
          <span className="font-medium text-foreground">
            {p.ancho} × {p.alto} m
          </span>
        </div>
      </div>

      <Separator />

      <div className="py-2">
        <p className="pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Materiales
        </p>
        <Fila
          label="Marco"
          detalle={`Perímetro ${r.perimetro.toFixed(2)} m`}
          valor={moneda(r.costoMarco)}
          mostrarValor={!esCliente}
        />
        <Fila
          label="Batiente"
          detalle={`${(p.alto * 2).toFixed(2)} m`}
          valor={moneda(r.costoBatiente)}
          mostrarValor={!esCliente}
        />
        <Fila
          label="Travesaños"
          detalle={`${p.cantTravesanos} u · ${(p.cantTravesanos * p.ancho).toFixed(2)} m`}
          valor={moneda(r.costoTravesano)}
          mostrarValor={!esCliente}
        />
        <Fila
          label="Tablillas"
          detalle={`${r.cantidadTablillas} u · ${r.metrosTablilla.toFixed(2)} m`}
          valor={moneda(r.costoTablilla)}
          mostrarValor={!esCliente}
        />
        {p.revAncho > 0 && p.revAlto > 0 ? (
          <Fila
            label="Revestimiento"
            detalle={`${p.revAncho} × ${p.revAlto} m · ${r.m2Revestimiento.toFixed(2)} m²`}
            valor={moneda(r.costoRevestimiento)}
            mostrarValor={!esCliente}
          />
        ) : (
          <Fila label="Revestimiento" detalle="Sin revestimiento" valor={moneda(0)} mostrarValor={!esCliente} />
        )}
        {Boolean(p.panoFijoEnabled) && p.panoFijoAlto > 0 && p.panoFijoAncho > 0 ? (
          <>
            <Fila
              label="Paño fijo"
              detalle={`Perímetro ${((p.panoFijoAlto + p.panoFijoAncho) * 2).toFixed(2)} m`}
              valor={moneda(r.costoPanoFijo)}
              mostrarValor={!esCliente}
            />
            {Boolean(p.panoFijoRevEnabled) && r.costoPanoFijoRev > 0 ? (
              <Fila
                label="Revestimiento paño fijo"
                detalle={`${(p.panoFijoAlto * p.panoFijoAncho).toFixed(2)} m²`}
                valor={moneda(r.costoPanoFijoRev)}
                mostrarValor={!esCliente}
              />
            ) : null}
          </>
        ) : null}
      </div>

      <Separator />

      <div className="py-2">
        <p className="pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Accesorios
        </p>
        <Fila
          label="Bisagras"
          detalle={`${p.bisagras} u`}
          valor={moneda(r.costoBisagras)}
          mostrarValor={!esCliente}
        />
        <Fila 
          label="Cerradura" 
          valor={moneda(r.costoCerradura)}
          mostrarValor={!esCliente}
        />
        <Fila 
          label="Picaporte" 
          valor={moneda(r.costoPicaporte)}
          mostrarValor={!esCliente}
        />
        <Fila
          label="Burlete"
          detalle={`${r.metrosBurlete.toFixed(2)} m (alto × 2)`}
          valor={moneda(r.costoBurlete)}
          mostrarValor={!esCliente}
        />
        <Fila
          label="Otros insumos"
          detalle={`${p.porcentajeOtros}% del material`}
          valor={moneda(r.costoOtros)}
          mostrarValor={!esCliente}
        />
      </div>

      {!esCliente && <Separator />}

      {!esCliente && (
        <div className="py-2">
          <Fila label="Costo de fabricación" valor={moneda(r.costoMateriales)} />
          <Fila
            label={`Ganancia (${p.ganancia}%)`}
            valor={moneda(r.ganancia)}
          />
        </div>
      )}

      <div className="mt-2 flex items-center justify-between rounded-lg bg-primary px-5 py-4 text-primary-foreground">
        <span className="text-sm font-medium uppercase tracking-wide">Total</span>
        <span className="font-mono text-2xl font-bold tabular-nums">
          {moneda(r.total)}
        </span>
      </div>

      <p className="pt-4 text-center text-[11px] text-muted-foreground">
        Presupuesto orientativo. Valores sujetos a confirmación. Validez 7 días.
      </p>
    </div>
  )
}
