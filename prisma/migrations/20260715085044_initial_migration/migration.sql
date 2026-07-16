-- CreateEnum
CREATE TYPE "PipelineStatus" AS ENUM ('OPEN', 'CLOSED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'OPERATOR', 'RESIDENT');

-- CreateTable
CREATE TABLE "pipelines" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "area_served" TEXT NOT NULL,
    "flow_rate" DOUBLE PRECISION,
    "description" TEXT,
    "status" "PipelineStatus" NOT NULL DEFAULT 'CLOSED',
    "last_open" TIMESTAMP(3),
    "total_subs" INTEGER,
    "routine_summary" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "deleted_by" TEXT,

    CONSTRAINT "pipelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" SERIAL NOT NULL,
    "user_code" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pipelines_created_at_idx" ON "pipelines"("created_at");

-- CreateIndex
CREATE INDEX "pipelines_updated_at_idx" ON "pipelines"("updated_at");

-- CreateIndex
CREATE INDEX "pipelines_deleted_at_idx" ON "pipelines"("deleted_at");

-- CreateIndex
CREATE INDEX "pipelines_created_by_idx" ON "pipelines"("created_by");

-- CreateIndex
CREATE INDEX "pipelines_updated_by_idx" ON "pipelines"("updated_by");

-- CreateIndex
CREATE INDEX "pipelines_deleted_by_idx" ON "pipelines"("deleted_by");

-- CreateIndex
CREATE INDEX "pipelines_status_idx" ON "pipelines"("status");

-- CreateIndex
CREATE UNIQUE INDEX "users_code_key" ON "users"("code");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "pipelines" ADD CONSTRAINT "pipelines_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pipelines" ADD CONSTRAINT "pipelines_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pipelines" ADD CONSTRAINT "pipelines_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_code_fkey" FOREIGN KEY ("user_code") REFERENCES "users"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
