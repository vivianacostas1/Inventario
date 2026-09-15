-- Add offer fields to productos

ALTER TABLE "productos"
ADD COLUMN "esta_en_oferta" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "productos"
ADD COLUMN "precio_oferta" DECIMAL(12,2);

CREATE INDEX "productos_esta_en_oferta_idx"
ON "productos"("esta_en_oferta");
