import { get } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    try {
      const result = await get(`cotizaciones/${id}.json`, {
        access: "private",
      })

      if (!result) {
        return NextResponse.json(
          { error: "Cotización no encontrada" },
          { status: 404 }
        )
      }

      const text = await result.stream?.text?.() || ""
      const cotizacion = JSON.parse(text)

      return NextResponse.json(cotizacion)
    } catch (e) {
      console.warn("Error retrieving cotización from Blob:", e)
      return NextResponse.json(
        { error: "Cotización no encontrada" },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error("Error getting cotización:", error)
    return NextResponse.json(
      { error: "Error al obtener la cotización" },
      { status: 500 }
    )
  }
}
