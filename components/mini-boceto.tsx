import type { Parametros } from "@/lib/cotizador"

// Boceto compacto de la puerta cotizada, pensado para mostrarse dentro de
// la celda "Descripción" de la tabla del presupuesto A4.
export function MiniBoceto({ parametros: p }: { parametros: Parametros }) {
  const tienePano =
    Boolean(p.panoFijoEnabled) && p.panoFijoAncho > 0 && p.panoFijoAlto > 0
  const tieneRev = p.revAncho > 0 && p.revAlto > 0

  const pos = tienePano ? Number(p.panoFijoPosicion) : -1
  const posIzquierda = pos === 0
  const posArriba = pos === 2
  const posAmbos = pos === 3

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

  const escala =
    anchoTotal > 0 && altoTotal > 0 ? 90 / Math.max(anchoTotal, altoTotal) : 50

  const margen = 6
  const anchoSvg = anchoTotal * escala + margen * 2
  const altoSvg = altoTotal * escala + margen * 2
  const baseY = margen + altoTotal * escala
  const marco = 3

  // ---- Puerta ----
  const puertaW = p.ancho * escala
  const puertaH = p.alto * escala
  let puertaX = margen
  if (tienePano) {
    if (posIzquierda || posAmbos) {
      puertaX = margen + (p.panoFijoAncho + gap) * escala
    } else if (posArriba) {
      puertaX = margen + ((anchoTotal - p.ancho) / 2) * escala
    }
  }
  const puertaY = baseY - puertaH

  const intX = puertaX + marco
  const intY = puertaY + marco
  const intW = puertaW - marco * 2
  const intH = puertaH - marco * 2

  // Revestimiento (panel superior centrado)
  const revH = tieneRev ? Math.min(p.revAlto, p.alto) * escala - marco : 0
  const revW = tieneRev
    ? Math.max(0, Math.min(p.revAncho, p.ancho) * escala - marco)
    : 0
  const revX = intX + (intW - revW) / 2
  const revY = intY

  // Tablillas
  const tablillaY = tieneRev ? revY + revH + 2 : intY
  const numTablillas =
    p.anchoTablilla > 0
      ? Math.max(1, Math.min(10, Math.round(intW / (p.anchoTablilla * escala))))
      : 0

  // ---- Paño(s) fijo(s) ----
  const panoW = tienePano ? p.panoFijoAncho * escala : 0
  const panoH = tienePano ? p.panoFijoAlto * escala : 0
  const panos: { x: number; y: number }[] = []
  if (tienePano) {
    if (posArriba) {
      panos.push({
        x: margen + ((anchoTotal - p.panoFijoAncho) / 2) * escala,
        y: margen,
      })
    } else if (posIzquierda) {
      panos.push({ x: margen, y: baseY - panoH })
    } else if (posAmbos) {
      panos.push({ x: margen, y: baseY - panoH })
      panos.push({
        x: margen + (p.panoFijoAncho + gap + p.ancho + gap) * escala,
        y: baseY - panoH,
      })
    } else {
      panos.push({ x: margen + (p.ancho + gap) * escala, y: baseY - panoH })
    }
  }

  return (
    <svg
      viewBox={`0 0 ${anchoSvg} ${altoSvg}`}
      className="h-auto w-[88px]"
      role="img"
      aria-label={`Boceto de puerta ${p.ancho} por ${p.alto} metros`}
    >
      <defs>
        <pattern
          id="vidrio-mini"
          width="5"
          height="5"
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="0" x2="0" y2="5" stroke="#1e2a52" strokeOpacity="0.35" strokeWidth="0.8" />
        </pattern>
      </defs>

      {/* Marco de la puerta */}
      <rect
        x={puertaX}
        y={puertaY}
        width={puertaW}
        height={puertaH}
        rx="1"
        fill="#eef0f4"
        stroke="#1e2a52"
        strokeWidth={marco}
      />
      <rect x={intX} y={intY} width={intW} height={intH} fill="#ffffff" />

      {/* Tablillas verticales */}
      {numTablillas > 0 &&
        Array.from({ length: numTablillas }).map((_, i) => {
          const x = intX + ((i + 1) * intW) / (numTablillas + 1)
          return (
            <line
              key={`t-${i}`}
              x1={x}
              y1={tablillaY}
              x2={x}
              y2={baseY - marco}
              stroke="#1e2a52"
              strokeOpacity="0.3"
              strokeWidth="0.7"
            />
          )
        })}

      {/* Revestimiento */}
      {tieneRev && revH > 0 && revW > 0 && (
        <rect
          x={revX}
          y={revY}
          width={revW}
          height={revH}
          fill="url(#vidrio-mini)"
          stroke="#1e2a52"
          strokeWidth="1"
        />
      )}

      {/* Picaporte */}
      <circle cx={intX + intW - 4} cy={puertaY + puertaH / 2} r="1.8" fill="#1e2a52" />

      {/* Paño(s) fijo(s) */}
      {panos.map((pano, i) => (
        <g key={`p-${i}`}>
          <rect
            x={pano.x}
            y={pano.y}
            width={panoW}
            height={panoH}
            rx="1"
            fill="#eef0f4"
            stroke="#1e2a52"
            strokeWidth={marco}
          />
          <rect
            x={pano.x + marco}
            y={pano.y + marco}
            width={panoW - marco * 2}
            height={panoH - marco * 2}
            fill="#ffffff"
          />
        </g>
      ))}
    </svg>
  )
}
