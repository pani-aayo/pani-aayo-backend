import { Module } from '@nestjs/common';
import PipelineController from './application/controllers/pipeline.controller';
import CreatePipelineUsecase from './application/usecases/create-pipeline.usecase';
import FetchAssignedPipelinesUsecase from './application/usecases/fetch-assigned-pipelines.usecase';
import ListPipelinesUsecase from './application/usecases/list-pipelines.usecase';
import PipelineRepo from './infrastructure/repos/pipeline.repo';

@Module({
  imports: [],
  controllers: [PipelineController],
  providers: [CreatePipelineUsecase, ListPipelinesUsecase, FetchAssignedPipelinesUsecase, PipelineRepo],
  exports: [],
})
export class PipelineModule {}
