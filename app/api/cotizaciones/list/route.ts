import { get } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    let cotizacionesExistentes = []
    
    try {
      const indexResult = await get("cotizaciones/index.json", {
        access: "private",
      })
      if (indexResult) {
        const text = await indexResult.stream?.text?.() || ""
        if (text) {
          cotizacionesExistentes = JSON.parse(text)
        }
      }
    } catch (e) {
      console.log("No cotizaciones index found in Blob")
    }

    // Agrupar por cliente
    const agrupadas = cotizacionesExistentes.reduce(
      (acc: Record<string, unknown[]>, cotizacion: any) => {
        const cliente = cotizacion.nombreCliente
        if (!acc[cliente]) {
          acc[cliente] = []
        }
        acc[cliente].push(cotizacion)
        return acc
      },
      {}
    )

    // Ordenar cada grupo por fecha descendente
    Object.keys(agrupadas).forEach((cliente) => {
      (agrupadas[cliente] as any[]).sort(
        (a, b) =>
          new Date(b.fechaCreacion).getTime() -
          new Date(a.fechaCreacion).getTime()
      )
    })

    return NextResponse.json(agrupadas)
  } catch (error) {
    console.error("Error listing cotizaciones:", error)
    return NextResponse.json({})
  }
}
