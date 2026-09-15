CREATE TABLE "zonas_entrega" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "esta_activa" BOOLEAN NOT NULL DEFAULT true,
    "prioridad" INTEGER NOT NULL DEFAULT 0,
    "tipo_zona" TEXT NOT NULL DEFAULT 'POLYGON',
    "coordenadas" JSONB,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zonas_entrega_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "zonas_entrega_esta_activa_idx"
ON "zonas_entrega"("esta_activa");

CREATE INDEX "zonas_entrega_prioridad_idx"
ON "zonas_entrega"("prioridad");