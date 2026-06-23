export type Parametros = {
  ancho: number
  alto: number
  precioKg: number
  ganancia: number
  pesoMarco: number
  pesoBatiente: number
  pesoTravesano: number
  pesoTablilla: number
  cantTravesanos: number
  anchoTablilla: number
  panoFijoEnabled: boolean
  // Ubicación del paño fijo: 0 = izquierda, 1 = derecha, 2 = arriba, 3 = ambos lados
  panoFijoPosicion: number
  panoFijoAlto: number
  panoFijoAncho: number
  panoFijoKgm: number
  panoFijoRevEnabled: boolean
  panoFijoRevPrecioM2: number
  revAncho: number
  revAlto: number
  precioRevM2: number
  bisagras: number
  precioBisagra: number
  cerradura: number
  picaporte: number
  precioBurlete: number
  porcentajeOtros: number
}

export type Resultado = {
  perimetro: number
  costoMarco: number
  costoBatiente: number
  costoTravesano: number
  cantidadTablillas: number
  metrosTablilla: number
  costoTablilla: number
  costoAluminio: number
  m2Revestimiento: number
  costoRevestimiento: number
  costoPanoFijo: number
  costoPanoFijoRev: number
  costoBisagras: number
  costoCerradura: number
  costoPicaporte: number
  metrosBurlete: number
  costoBurlete: number
  costoOtros: number
  costoAccesorios: number
  costoMateriales: number
  ganancia: number
  total: number
}

export const VALORES_INICIALES: Parametros = {
  ancho: 0.8,
  alto: 2.0,
  precioKg: 11000,
  ganancia: 30,
  pesoMarco: 0.536,
  pesoBatiente: 1,
  pesoTravesano: 1.47,
  pesoTablilla: 0.65,
  cantTravesanos: 3,
  anchoTablilla: 0.11,
  panoFijoEnabled: false,
  panoFijoPosicion: 1,
  panoFijoAlto: 0,
  panoFijoAncho: 0,
  panoFijoKgm: 0,
  panoFijoRevEnabled: false,
  panoFijoRevPrecioM2: 0,
  revAncho: 0,
  revAlto: 0,
  precioRevM2: 0,
  bisagras: 3,
  precioBisagra: 5000,
  cerradura: 15000,
  picaporte: 5000,
  precioBurlete: 2500,
  porcentajeOtros: 5,
}

export function calcular(p: Parametros): Resultado {
  const perimetro = (p.ancho + p.alto) * 2

  const costoMarco = perimetro * p.pesoMarco * p.precioKg
  const costoBatiente = p.alto * 2 * p.pesoBatiente * p.precioKg
  const costoTravesano = p.cantTravesanos * p.ancho * p.pesoTravesano * p.precioKg

  const m2Puerta = p.ancho * p.alto
  const m2Revestimiento = Math.min(p.revAncho * p.revAlto, m2Puerta)
  const costoRevestimiento = m2Revestimiento * p.precioRevM2

  // La superficie cubierta por el revestimiento se descuenta de las tablillas
  const m2Tablilla = Math.max(0, m2Puerta - m2Revestimiento)
  const metrosTablilla = p.anchoTablilla > 0 ? m2Tablilla / p.anchoTablilla : 0
  const cantidadTablillas = p.alto > 0 ? Math.ceil(metrosTablilla / p.alto) : 0
  const costoTablilla = metrosTablilla * p.pesoTablilla * p.precioKg

  const costoAluminio =
    costoMarco + costoBatiente + costoTravesano + costoTablilla

  // Si el paño fijo va de ambos lados, se cotiza el doble (uno por lado)
  const factorPanoFijo = Boolean(p.panoFijoEnabled) && p.panoFijoPosicion === 3 ? 2 : 1

  const perimetroPanoFijo = Boolean(p.panoFijoEnabled) ? (p.panoFijoAlto + p.panoFijoAncho) * 2 : 0
  const costoPanoFijo = perimetroPanoFijo * p.panoFijoKgm * p.precioKg * factorPanoFijo

  const m2PanoFijo = Boolean(p.panoFijoEnabled) ? p.panoFijoAlto * p.panoFijoAncho : 0
  const costoPanoFijoRev =
    Boolean(p.panoFijoRevEnabled) ? m2PanoFijo * p.panoFijoRevPrecioM2 * factorPanoFijo : 0

  const costoBisagras = p.bisagras * p.precioBisagra
  const costoCerradura = p.cerradura
  const costoPicaporte = p.picaporte
  const metrosBurlete = p.alto * 2
  const costoBurlete = metrosBurlete * p.precioBurlete
  const costoOtros = costoAluminio * (p.porcentajeOtros / 100)

  const costoAccesorios =
    costoBisagras + costoCerradura + costoPicaporte + costoBurlete

  const costoMateriales =
    costoMarco +
    costoBatiente +
    costoTravesano +
    costoTablilla +
    costoRevestimiento +
    costoPanoFijo +
    costoPanoFijoRev +
    costoAccesorios +
    costoOtros

  const ganancia = costoMateriales * (p.ganancia / 100)
  const total = costoMateriales + ganancia

  return {
    perimetro,
    costoMarco,
    costoBatiente,
    costoTravesano,
    cantidadTablillas,
    metrosTablilla,
    costoTablilla,
    costoAluminio,
    m2Revestimiento,
    costoRevestimiento,
    costoPanoFijo,
    costoPanoFijoRev,
    costoBisagras,
    costoCerradura,
    costoPicaporte,
    metrosBurlete,
    costoBurlete,
    costoOtros,
    costoAccesorios,
    costoMateriales,
    ganancia,
    total,
  }
}

export function moneda(valor: number): string {
  return valor.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  })
}
