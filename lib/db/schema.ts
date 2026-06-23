import { json, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const cotizaciones = pgTable("cotizaciones", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombreCliente: text("nombreCliente").notNull(),
  presupuestoAdministrativo: json("presupuestoAdministrativo").notNull(),
  presupuestoCliente: json("presupuestoCliente").notNull(),
  parametros: json("parametros").notNull(),
  fechaCreacion: timestamp("fechaCreacion").defaultNow(),
  notas: text("notas"),
  createdAt: timestamp("createdAt").defaultNow(),
})
