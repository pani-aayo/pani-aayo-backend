-- AddForeignKey
ALTER TABLE "pipeline_operators" ADD CONSTRAINT "pipeline_operators_operator_code_fkey" FOREIGN KEY ("operator_code") REFERENCES "users"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
