-- AlterTable
ALTER TABLE "dividendos" ADD COLUMN     "producto_id" TEXT;

-- CreateTable
CREATE TABLE "accionistas_productos" (
    "id" TEXT NOT NULL,
    "accionista_id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "asignado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accionistas_productos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "accionistas_productos_accionista_id_idx" ON "accionistas_productos"("accionista_id");

-- CreateIndex
CREATE INDEX "accionistas_productos_producto_id_idx" ON "accionistas_productos"("producto_id");

-- CreateIndex
CREATE UNIQUE INDEX "accionistas_productos_accionista_id_producto_id_key" ON "accionistas_productos"("accionista_id", "producto_id");

-- CreateIndex
CREATE INDEX "dividendos_producto_id_idx" ON "dividendos"("producto_id");

-- AddForeignKey
ALTER TABLE "accionistas_productos" ADD CONSTRAINT "accionistas_productos_accionista_id_fkey" FOREIGN KEY ("accionista_id") REFERENCES "accionistas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accionistas_productos" ADD CONSTRAINT "accionistas_productos_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dividendos" ADD CONSTRAINT "dividendos_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
