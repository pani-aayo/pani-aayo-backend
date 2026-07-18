-- CreateTable
CREATE TABLE "pipeline_routines" (
    "id" SERIAL NOT NULL,
    "routine_code" TEXT NOT NULL,
    "pipeline_code" TEXT NOT NULL,
    "routine" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "pipeline_routines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pipeline_routines_routine_code_key" ON "pipeline_routines"("routine_code");

-- CreateIndex
CREATE UNIQUE INDEX "pipeline_routines_pipeline_code_key" ON "pipeline_routines"("pipeline_code");

-- CreateIndex
CREATE INDEX "pipeline_routines_pipeline_code_idx" ON "pipeline_routines"("pipeline_code");

-- CreateIndex
CREATE INDEX "pipeline_routines_created_at_idx" ON "pipeline_routines"("created_at");

-- CreateIndex
CREATE INDEX "pipeline_routines_updated_at_idx" ON "pipeline_routines"("updated_at");

-- CreateIndex
CREATE INDEX "pipeline_routines_created_by_idx" ON "pipeline_routines"("created_by");

-- CreateIndex
CREATE INDEX "pipeline_routines_updated_by_idx" ON "pipeline_routines"("updated_by");

-- AddForeignKey
ALTER TABLE "pipeline_routines" ADD CONSTRAINT "pipeline_routines_pipeline_code_fkey" FOREIGN KEY ("pipeline_code") REFERENCES "pipelines"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
