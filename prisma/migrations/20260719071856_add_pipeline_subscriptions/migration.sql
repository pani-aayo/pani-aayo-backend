-- CreateTable
CREATE TABLE "pipeline_subscriptions" (
    "id" SERIAL NOT NULL,
    "pipeline_code" TEXT NOT NULL,
    "user_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pipeline_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pipeline_subscriptions_pipeline_code_idx" ON "pipeline_subscriptions"("pipeline_code");

-- CreateIndex
CREATE INDEX "pipeline_subscriptions_user_code_idx" ON "pipeline_subscriptions"("user_code");

-- CreateIndex
CREATE UNIQUE INDEX "pipeline_subscriptions_pipeline_code_user_code_key" ON "pipeline_subscriptions"("pipeline_code", "user_code");

-- AddForeignKey
ALTER TABLE "pipeline_subscriptions" ADD CONSTRAINT "pipeline_subscriptions_pipeline_code_fkey" FOREIGN KEY ("pipeline_code") REFERENCES "pipelines"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pipeline_subscriptions" ADD CONSTRAINT "pipeline_subscriptions_user_code_fkey" FOREIGN KEY ("user_code") REFERENCES "users"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
