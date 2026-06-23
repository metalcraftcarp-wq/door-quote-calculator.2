"use client"

import type { Parametros, Resultado } from "@/lib/cotizador"

type Props = {
  parametros: Parametros
  resultado: Resultado
}

export function BocetoPuerta({ parametros: p, resultado: r }: Props) {
  const tienePano =
    Boolean(p.panoFijoEnabled) && p.panoFijoAncho > 0 && p.panoFijoAlto > 0
  const tieneRev = p.revAncho > 0 && p.revAlto > 0
  const tienePanoRev = tienePano && Boolean(p.panoFijoRevEnabled) && r.costoPanoFijoRev > 0

  // Ubicación del paño fijo: 0 = izquierda, 1 = derecha, 2 = arriba, 3 = ambos
  const pos = tienePano ? Number(p.panoFijoPosicion) : -1
  const posIzquierda = pos === 0
  const posArriba = pos === 2
  const posAmbos = pos === 3
  const nombrePosicion =
    pos === 0 ? "izquierda" : pos === 2 ? "arriba" : pos === 3 ? "ambos lados" : "derecha"

  // Separación visual entre puerta y paño fijo (5 cm)
  const gap = tienePano ? 0.05 : 0

  let anchoTotal = p.ancho
  let altoTotal = p.alto
  if (tienePano) {
    if (posArriba) {
      anchoTotal = Math.max(p.ancho, p.panoFijoAncho)
      altoTotal = p.alto + gap + p.panoFijoAlto
    } else if (posAmbos) {
      anchoTotal = p.panoFijoAncho + gap + p.ancho + gap + p.panoFijoAncho
      altoTotal = Math.max(p.alto, p.panoFijoAlto)
    } else {
      anchoTotal = p.ancho + gap + p.panoFijoAncho
      altoTotal = Math.max(p.alto, p.panoFijoAlto)
    }
  }

  // Escala para que el dibujo entre cómodo en el viewBox
  const escala = anchoTotal > 0 && altoTotal > 0 ? 320 / Math.max(anchoTotal, altoTotal) : 100

  const margenIzq = 56
  const margenDer = 24
  const margenSup = 36
  const margenInf = 48

  const anchoSvg = anchoTotal * escala + margenIzq + margenDer
  const altoSvg = altoTotal * escala + margenSup + margenInf

  // Línea base inferior (la puerta y el paño "apoyan" abajo)
  const baseY = margenSup + altoTotal * escala

  // Marco
  const marco = 6

  // ---- Puerta ----
  const puertaW = p.ancho * escala
  const puertaH = p.alto * escala
  let puertaX = margenIzq
  if (tienePano) {
    if (posIzquierda || posAmbos) {
      puertaX = margenIzq + (p.panoFijoAncho + gap) * escala
    } else if (posArriba) {
      puertaX = margenIzq + ((anchoTotal - p.ancho) / 2) * escala
    }
  }
  const puertaY = baseY - puertaH

  // Interior de la puerta (descontando el marco)
  const intX = puertaX + marco
  const intY = puertaY + marco
  const intW = puertaW - marco * 2
  const intH = puertaH - marco * 2

  // Zona de revestimiento (arriba, centrado horizontalmente)
  const revH = tieneRev ? Math.min(p.revAlto, p.alto) * escala - marco : 0
  const revWReal = Math.min(p.revAncho, p.ancho)
  const revW = tieneRev ? Math.max(0, revWReal * escala - marco) : 0
  const revX = intX + (intW - revW) / 2
  const revY = intY

  // Zona de tablillas (debajo del revestimiento)
  const tablillaY = tieneRev ? revY + revH + 4 : intY
  const tablillaH = Math.max(0, baseY - marco - tablillaY)

  // Cantidad de tablillas a dibujar (limitado para que se vea bien)
  const numTablillas =
    p.anchoTablilla > 0 ? Math.max(1, Math.min(24, Math.round(intW / (p.anchoTablilla * escala)))) : 0

  // ---- Paño(s) fijo(s) ----
  const panoW = tienePano ? p.panoFijoAncho * escala : 0
  const panoH = tienePano ? p.panoFijoAlto * escala : 0

  // Posición(es) del/los paño(s) según ubicación elegida
  const panos: { x: number; y: number }[] = []
  if (tienePano) {
    if (posArriba) {
      panos.push({
        x: margenIzq + ((anchoTotal - p.panoFijoAncho) / 2) * escala,
        y: margenSup,
      })
    } else if (posIzquierda) {
      panos.push({ x: margenIzq, y: baseY - panoH })
    } else if (posAmbos) {
      panos.push({ x: margenIzq, y: baseY - panoH })
      panos.push({
        x: margenIzq + (p.panoFijoAncho + gap + p.ancho + gap) * escala,
        y: baseY - panoH,
      })
    } else {
      // derecha
      panos.push({ x: margenIzq + (p.ancho + gap) * escala, y: baseY - panoH })
    }
  }

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Boceto técnico
          </p>
          <p className="text-xs text-muted-foreground">
            Esquema ilustrativo · medidas en metros
          </p>
        </div>
        <p className="font-mono text-sm font-medium tabular-nums text-foreground">
          {p.ancho} × {p.alto} m
        </p>
      </div>

      <div className="overflow-x-auto py-4">
        <svg
          viewBox={`0 0 ${anchoSvg} ${altoSvg}`}
          className="mx-auto h-auto w-full max-w-[460px]"
          role="img"
          aria-label="Boceto técnico de la puerta con sus medidas y componentes"
        >
          <defs>
            <pattern
              id="vidrio"
              width="8"
              height="8"
              patternTransform="rotate(45)"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="8"
                className="stroke-primary/30"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          {/* ===== PUERTA ===== */}
          {/* Marco exterior */}
          <rect
            x={puertaX}
            y={puertaY}
            width={puertaW}
            height={puertaH}
            rx="2"
            className="fill-muted stroke-foreground"
            strokeWidth={marco}
          />
          {/* Interior */}
          <rect
            x={intX}
            y={intY}
            width={intW}
            height={intH}
            className="fill-card"
          />

          {/* Tablillas verticales */}
          {numTablillas > 0 &&
            tablillaH > 0 &&
            Array.from({ length: numTablillas }).map((_, i) => {
              const x = intX + ((i + 1) * intW) / (numTablillas + 1)
              return (
                <line
                  key={`tab-${i}`}
                  x1={x}
                  y1={tablillaY}
                  x2={x}
                  y2={baseY - marco}
                  className="stroke-muted-foreground/40"
                  strokeWidth="1"
                />
              )
            })}

          {/* Revestimiento */}
          {tieneRev && revH > 0 && revW > 0 && (
            <>
              <rect
                x={revX}
                y={revY}
                width={revW}
                height={revH}
                className="fill-[url(#vidrio)] stroke-primary"
                strokeWidth="1.5"
              />
              <text
                x={revX + revW / 2}
                y={revY + revH / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-primary text-[9px] font-medium"
              >
                Revestimiento
              </text>
            </>
          )}

          {/* Picaporte / manija (lado del batiente) */}
          <circle
            cx={intX + intW - 8}
            cy={puertaY + puertaH / 2}
            r="3"
            className="fill-foreground"
          />

          {/* ===== PAÑO(S) FIJO(S) ===== */}
          {panos.map((pano, i) => {
            const ix = pano.x + marco
            const iy = pano.y + marco
            const iw = panoW - marco * 2
            const ih = panoH - marco * 2
            return (
              <g key={`pano-${i}`}>
                <rect
                  x={pano.x}
                  y={pano.y}
                  width={panoW}
                  height={panoH}
                  rx="2"
                  className="fill-muted stroke-foreground"
                  strokeWidth={marco}
                />
                <rect
                  x={ix}
                  y={iy}
                  width={iw}
                  height={ih}
                  className={tienePanoRev ? "fill-[url(#vidrio)]" : "fill-card"}
                />
                <text
                  x={ix + iw / 2}
                  y={iy + ih / 2 - 5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-muted-foreground text-[9px] font-medium"
                >
                  Paño fijo
                </text>
                <text
                  x={ix + iw / 2}
                  y={iy + ih / 2 + 7}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-muted-foreground text-[8px]"
                >
                  {p.panoFijoAncho} × {p.panoFijoAlto} m
                </text>
              </g>
            )
          })}

          {/* ===== COTAS / MEDIDAS ===== */}
          {/* Alto de la puerta (a la izquierda del dibujo) */}
          <line
            x1={margenIzq - 14}
            y1={puertaY}
            x2={margenIzq - 14}
            y2={baseY}
            className="stroke-muted-foreground"
            strokeWidth="1"
          />
          <line
            x1={margenIzq - 18}
            y1={puertaY}
            x2={margenIzq - 10}
            y2={puertaY}
            className="stroke-muted-foreground"
            strokeWidth="1"
          />
          <line
            x1={margenIzq - 18}
            y1={baseY}
            x2={margenIzq - 10}
            y2={baseY}
            className="stroke-muted-foreground"
            strokeWidth="1"
          />
          <text
            x={margenIzq - 22}
            y={puertaY + puertaH / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(-90 ${margenIzq - 22} ${puertaY + puertaH / 2})`}
            className="fill-foreground text-[10px] font-medium"
          >
            {p.alto} m
          </text>

          {/* Ancho (debajo de la puerta) */}
          <line
            x1={puertaX}
            y1={baseY + 14}
            x2={puertaX + puertaW}
            y2={baseY + 14}
            className="stroke-muted-foreground"
            strokeWidth="1"
          />
          <line
            x1={puertaX}
            y1={baseY + 10}
            x2={puertaX}
            y2={baseY + 18}
            className="stroke-muted-foreground"
            strokeWidth="1"
          />
          <line
            x1={puertaX + puertaW}
            y1={baseY + 10}
            x2={puertaX + puertaW}
            y2={baseY + 18}
            className="stroke-muted-foreground"
            strokeWidth="1"
          />
          <text
            x={puertaX + puertaW / 2}
            y={baseY + 30}
            textAnchor="middle"
            className="fill-foreground text-[10px] font-medium"
          >
            {p.ancho} m
          </text>

        </svg>
      </div>

      {/* Detalle del boceto */}
      <div className="border-t border-border pt-4">
        <p className="pb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Detalle del boceto
        </p>

        <dl className="flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between gap-4">
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <span className="inline-block size-3 rounded-sm border-2 border-foreground bg-muted" />
              Marco
            </dt>
            <dd className="font-medium tabular-nums text-foreground">
              {p.ancho} × {p.alto} m
            </dd>
          </div>

          {r.metrosTablilla > 0 && (
            <div className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <span className="inline-block h-3 w-3 border-l-2 border-r-2 border-muted-foreground/40" />
                Tablillas
              </dt>
              <dd className="font-medium tabular-nums text-foreground">
                {r.cantidadTablillas} u · {r.metrosTablilla.toFixed(2)} m
              </dd>
            </div>
          )}

          {p.cantTravesanos > 0 && (
            <div className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <span className="inline-block h-3 w-3 border-t-2 border-b-2 border-foreground/50" />
                Travesaños
              </dt>
              <dd className="font-medium tabular-nums text-foreground">
                {p.cantTravesanos} u
              </dd>
            </div>
          )}

          {tienePano && (
            <div className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <span className="inline-block size-3 rounded-sm border-2 border-foreground bg-muted" />
                Paño fijo ({nombrePosicion})
              </dt>
              <dd className="font-medium tabular-nums text-foreground">
                {posAmbos ? "2 × " : ""}
                {p.panoFijoAncho} × {p.panoFijoAlto} m
              </dd>
            </div>
          )}
        </dl>

        {/* Detalle del revestimiento: cómo se ve */}
        {tieneRev && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
            <svg
              viewBox="0 0 48 48"
              className="size-12 shrink-0"
              role="img"
              aria-label="Vista del revestimiento"
            >
              <defs>
                <pattern
                  id="vidrio-detalle"
                  width="6"
                  height="6"
                  patternTransform="rotate(45)"
                  patternUnits="userSpaceOnUse"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="6"
                    className="stroke-primary/40"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect
                x="2"
                y="2"
                width="44"
                height="44"
                rx="2"
                className="fill-[url(#vidrio-detalle)] stroke-primary"
                strokeWidth="1.5"
              />
            </svg>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-primary">
                Revestimiento
              </span>
              <span className="text-xs text-muted-foreground">
                {p.revAncho} × {p.revAlto} m · {r.m2Revestimiento.toFixed(2)} m²
              </span>
              <span className="text-[11px] text-muted-foreground">
                Panel central trazado en diagonal, montado sobre las tablillas.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
