"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PuertasBalconPage() {
  const router = useRouter()

  return (
    <main className="min-h-svh bg-background">
      <header className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold leading-tight tracking-tight">
                WALUM · Cotizador
              </h1>
              <p className="text-sm text-primary-foreground/70">
                Puertas Balcón de aluminio
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-foreground">
            Cotizador de Puertas Balcón
          </h2>
          <p className="mb-6 text-muted-foreground">
            Esta funcionalidad está en desarrollo.
          </p>
          <Button onClick={() => router.back()} variant="outline">
            Volver atrás
          </Button>
        </div>
      </div>
    </main>
  )
}
