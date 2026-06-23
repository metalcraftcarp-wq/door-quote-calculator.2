import { put, list, get } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = body

    if (!data.nombreCliente) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      )
    }

    const cotizacionId = data.id || Math.random().toString(36).substr(2, 9)
    const nuevaCotizacion = {
      ...data,
      id: cotizacionId,
      fechaCreacion: data.fechaCreacion || new Date().toISOString(),
    }

    // Get existing cotizaciones list from Blob
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
      console.log("No existing cotizaciones index found, creating new one")
    }

    // Add new cotización
    cotizacionesExistentes.push(nuevaCotizacion)

    // Save updated index to Blob
    await put("cotizaciones/index.json", JSON.stringify(cotizacionesExistentes), {
      access: "private",
      contentType: "application/json",
    })

    // Also save individual cotización file
    await put(`cotizaciones/${cotizacionId}.json`, JSON.stringify(nuevaCotizacion), {
      access: "private",
      contentType: "application/json",
    })

    return NextResponse.json(nuevaCotizacion, { status: 201 })
  } catch (error) {
    console.error("Error saving cotización:", error)
    return NextResponse.json(
      { error: "Error al guardar la cotización" },
      { status: 500 }
    )
  }
}
