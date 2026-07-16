-- AlterTable
ALTER TABLE "pipelines" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "pipeline_operators" (
    "id" SERIAL NOT NULL,
    "pipeline_code" TEXT NOT NULL,
    "operator_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "pipeline_operators_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pipeline_operators_pipeline_code_idx" ON "pipeline_operators"("pipeline_code");

-- CreateIndex
CREATE INDEX "pipeline_operators_operator_code_idx" ON "pipeline_operators"("operator_code");

-- CreateIndex
CREATE UNIQUE INDEX "pipeline_operators_pipeline_code_operator_code_key" ON "pipeline_operators"("pipeline_code", "operator_code");

-- CreateIndex
CREATE UNIQUE INDEX "pipelines_code_key" ON "pipelines"("code");

-- AddForeignKey
ALTER TABLE "pipeline_operators" ADD CONSTRAINT "pipeline_operators_pipeline_code_fkey" FOREIGN KEY ("pipeline_code") REFERENCES "pipelines"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

