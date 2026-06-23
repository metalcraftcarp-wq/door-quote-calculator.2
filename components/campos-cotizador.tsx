"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Parametros } from "@/lib/cotizador"
import { Ruler, Layers, Wrench, PlusCircle, SquareStack, ChevronDown } from "lucide-react"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"

type Campo = {
  key: keyof Parametros
  label: string
  step?: string
  suffix?: string
}

type Grupo = {
  titulo: string
  subtitulo?: string
  icon: React.ReactNode
  campos: Campo[]
  especial?: string
}

const GRUPOS: Grupo[] = [
  {
    titulo: "Dimensiones y aluminio",
    icon: <Ruler className="size-4" />,
    campos: [
      { key: "ancho", label: "Ancho puerta", suffix: "m", step: "0.01" },
      { key: "alto", label: "Alto puerta", suffix: "m", step: "0.01" },
      { key: "precioKg", label: "Precio aluminio por Kg", suffix: "$", step: "100" },
      { key: "ganancia", label: "Ganancia", suffix: "%", step: "1" },
    ],
  },
  {
    titulo: "Pesos de perfiles (kg/m)",
    icon: <Layers className="size-4" />,
    campos: [
      { key: "pesoMarco", label: "Peso marco", suffix: "kg/m", step: "0.001" },
      { key: "pesoBatiente", label: "Peso batiente", suffix: "kg/m", step: "0.001" },
      { key: "pesoTravesano", label: "Peso travesaño", suffix: "kg/m", step: "0.001" },
      { key: "cantTravesanos", label: "Cantidad travesaños", step: "1" },
    ],
    especial: "tablilla",
  },
  {
    titulo: "Paño fijo",
    icon: <SquareStack className="size-4" />,
    campos: [
      { key: "panoFijoAlto", label: "Alto", suffix: "m", step: "0.01" },
      { key: "panoFijoAncho", label: "Ancho", suffix: "m", step: "0.01" },
      { key: "panoFijoKgm", label: "Peso del perfil", suffix: "kg/m", step: "0.001" },
    ],
    especial: "panoFijo",
  },
  {
    titulo: "Revestimiento",
    subtitulo: "(vidrio, policarbonato, etc.)",
    icon: <SquareStack className="size-4" />,
    campos: [
      { key: "revAncho", label: "Ancho", suffix: "m", step: "0.01" },
      { key: "revAlto", label: "Alto", suffix: "m", step: "0.01" },
      { key: "precioRevM2", label: "Precio por m²", suffix: "$", step: "100" },
    ],
    especial: "revestimiento",
  },
  {
    titulo: "Accesorios",
    icon: <Wrench className="size-4" />,
    campos: [
      { key: "bisagras", label: "Cantidad bisagras", step: "1" },
      { key: "precioBisagra", label: "Precio bisagra", suffix: "$", step: "100" },
      { key: "cerradura", label: "Cerradura", suffix: "$", step: "100" },
      { key: "picaporte", label: "Picaporte", suffix: "$", step: "100" },
      { key: "precioBurlete", label: "Precio burlete x metro", suffix: "$", step: "100" },
    ],
  },
  {
    titulo: "Otros insumos",
    icon: <PlusCircle className="size-4" />,
    campos: [
      {
        key: "porcentajeOtros",
        label: "Otros insumos (% del material)",
        suffix: "%",
        step: "0.5",
      },
    ],
  },
]

const POSICIONES_PANO: { value: number; label: string }[] = [
  { value: 0, label: "Izquierda" },
  { value: 1, label: "Derecha" },
  { value: 2, label: "Arriba" },
  { value: 3, label: "Ambos lados" },
]

type Props = {
  valores: Parametros
  onChange: (key: keyof Parametros, value: number) => void
}

export function CamposCotizador({ valores, onChange }: Props) {
  const [tipoTablilla, setTipoTablilla] = useState<"liviana" | "pesada">("liviana")
  const [panoFijoExpanded, setPanoFijoExpanded] = useState(false)
  const [panoFijoRevExpanded, setPanoFijoRevExpanded] = useState(false)
  const [revestimientoExpanded, setRevestimientoExpanded] = useState(false)

  const handleTablillaChange = (tipo: "liviana" | "pesada") => {
    setTipoTablilla(tipo)
    if (tipo === "liviana") {
      onChange("pesoTablilla", 0.65)
      onChange("anchoTablilla", 0.11)
    } else {
      onChange("pesoTablilla", 1.1)
      onChange("anchoTablilla", 0.12)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {GRUPOS.map((grupo) => (
        <Card key={grupo.titulo} className="border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-primary">
              <span className="flex size-7 items-center justify-center rounded-md bg-accent text-accent-foreground">
                {grupo.icon}
              </span>
              {grupo.titulo}
              {grupo.subtitulo ? (
                <span className="text-xs font-normal text-muted-foreground">
                  {grupo.subtitulo}
                </span>
              ) : null}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {grupo.especial === "tablilla" ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Tipo de tablilla</Label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTablillaChange("liviana")}
                      className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                        tipoTablilla === "liviana"
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/50"
                      }`}
                    >
                      Tablilla Liviana
                      <span className="block text-xs font-normal mt-1 opacity-75">
                        0.650 kg/m • 0.11 m
                      </span>
                    </button>
                    <button
                      onClick={() => handleTablillaChange("pesada")}
                      className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                        tipoTablilla === "pesada"
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/50"
                      }`}
                    >
                      Tablilla Pesada
                      <span className="block text-xs font-normal mt-1 opacity-75">
                        1.100 kg/m • 0.12 m
                      </span>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {grupo.campos.map((campo) => (
                    <div key={campo.key} className="flex flex-col gap-1.5">
                      <Label htmlFor={campo.key} className="text-sm font-medium">
                        {campo.label}
                        {campo.suffix ? (
                          <span className="ml-1 text-xs font-normal text-muted-foreground">
                            ({campo.suffix})
                          </span>
                        ) : null}
                      </Label>
                      <Input
                        id={campo.key}
                        type="number"
                        inputMode="decimal"
                        step={campo.step ?? "any"}
                        min={0}
                        value={Number.isNaN(valores[campo.key]) ? "" : valores[campo.key]}
                        onChange={(e) =>
                          onChange(campo.key, Number.parseFloat(e.target.value))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : grupo.especial === "panoFijo" ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Activar paño fijo</Label>
                  <Switch
                    checked={Boolean(valores.panoFijoEnabled)}
                    onCheckedChange={(checked) => onChange("panoFijoEnabled", checked ? 1 : 0)}
                  />
                </div>
                {Boolean(valores.panoFijoEnabled) && (
                  <>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium">Ubicación del paño fijo</Label>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {POSICIONES_PANO.map((op) => {
                          const activo = Number(valores.panoFijoPosicion) === op.value
                          return (
                            <button
                              key={op.value}
                              type="button"
                              onClick={() => onChange("panoFijoPosicion", op.value)}
                              className={`rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                                activo
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-background text-foreground hover:border-primary/50"
                              }`}
                            >
                              {op.label}
                            </button>
                          )
                        })}
                      </div>
                      {Number(valores.panoFijoPosicion) === 3 && (
                        <p className="text-xs text-muted-foreground">
                          Se cotiza x2 (un paño de cada lado).
                        </p>
                      )}
                    </div>
                    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 overflow-hidden transition-all duration-300`}>
                      {grupo.campos.map((campo) => (
                        <div key={campo.key} className="flex flex-col gap-1.5">
                          <Label htmlFor={campo.key} className="text-sm font-medium">
                            {campo.label}
                            {campo.suffix ? (
                              <span className="ml-1 text-xs font-normal text-muted-foreground">
                                ({campo.suffix})
                              </span>
                            ) : null}
                          </Label>
                          <Input
                            id={campo.key}
                            type="number"
                            inputMode="decimal"
                            step={campo.step ?? "any"}
                            min={0}
                            value={Number.isNaN(valores[campo.key]) ? "" : valores[campo.key]}
                            onChange={(e) =>
                              onChange(campo.key, Number.parseFloat(e.target.value))
                            }
                          />
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4">
                      <button
                        onClick={() => setPanoFijoRevExpanded(!panoFijoRevExpanded)}
                        className="flex items-center justify-between w-full mb-3 hover:opacity-75 transition-opacity"
                      >
                        <Label className="text-sm font-medium cursor-pointer">
                          Revestimiento paño fijo
                        </Label>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={Boolean(valores.panoFijoRevEnabled)}
                            onCheckedChange={(checked) => onChange("panoFijoRevEnabled", checked ? 1 : 0)}
                          />
                          <ChevronDown
                            className={`size-4 transition-transform duration-300 ${
                              panoFijoRevExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>
                      {panoFijoRevExpanded && Boolean(valores.panoFijoRevEnabled) && (
                        <div className="flex flex-col gap-1.5 animate-in fade-in duration-300">
                          <Label htmlFor="panoFijoRevPrecioM2" className="text-sm font-medium">
                            Precio material
                            <span className="ml-1 text-xs font-normal text-muted-foreground">
                              ($/m²)
                            </span>
                          </Label>
                          <Input
                            id="panoFijoRevPrecioM2"
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            min={0}
                            value={Number.isNaN(valores.panoFijoRevPrecioM2) ? "" : valores.panoFijoRevPrecioM2}
                            onChange={(e) =>
                              onChange("panoFijoRevPrecioM2", Number.parseFloat(e.target.value))
                            }
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : grupo.especial === "revestimiento" ? (
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setRevestimientoExpanded(!revestimientoExpanded)}
                  className="flex items-center justify-between hover:opacity-75 transition-opacity"
                >
                  <Label className="text-sm font-medium cursor-pointer">
                    Agregar revestimiento
                  </Label>
                  <Switch
                    checked={revestimientoExpanded}
                    onCheckedChange={(checked) => setRevestimientoExpanded(checked)}
                  />
                </button>
                {revestimientoExpanded && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-in fade-in duration-300">
                    {grupo.campos.map((campo) => (
                      <div key={campo.key} className="flex flex-col gap-1.5">
                        <Label htmlFor={campo.key} className="text-sm font-medium">
                          {campo.label}
                          {campo.suffix ? (
                            <span className="ml-1 text-xs font-normal text-muted-foreground">
                              ({campo.suffix})
                            </span>
                          ) : null}
                        </Label>
                        <Input
                          id={campo.key}
                          type="number"
                          inputMode="decimal"
                          step={campo.step ?? "any"}
                          min={0}
                          value={Number.isNaN(valores[campo.key]) ? "" : valores[campo.key]}
                          onChange={(e) =>
                            onChange(campo.key, Number.parseFloat(e.target.value))
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {grupo.campos.map((campo) => (
                  <div key={campo.key} className="flex flex-col gap-1.5">
                    <Label htmlFor={campo.key} className="text-sm font-medium">
                      {campo.label}
                      {campo.suffix ? (
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                          ({campo.suffix})
                        </span>
                      ) : null}
                    </Label>
                    <Input
                      id={campo.key}
                      type="number"
                      inputMode="decimal"
                      step={campo.step ?? "any"}
                      min={0}
                      value={Number.isNaN(valores[campo.key]) ? "" : valores[campo.key]}
                      onChange={(e) =>
                        onChange(campo.key, Number.parseFloat(e.target.value))
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
