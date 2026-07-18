import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import PipelineController from './application/controllers/pipeline.controller';
import CreatePipelineUsecase from './application/usecases/create-pipeline.usecase';
import CreatePipelineRoutineUsecase from './application/usecases/create-pipeline-routine.usecase';
import FetchAssignedPipelinesUsecase from './application/usecases/fetch-assigned-pipelines.usecase';
import ListPipelinesUsecase from './application/usecases/list-pipelines.usecase';
import SetPipelineOperatorsUsecase from './application/usecases/set-pipeline-operators.usecase';
import PipelineRepo from './infrastructure/repos/pipeline.repo';

@Module({
  imports: [UserModule],
  controllers: [PipelineController],
  providers: [
    CreatePipelineUsecase,
    ListPipelinesUsecase,
    FetchAssignedPipelinesUsecase,
    SetPipelineOperatorsUsecase,
    CreatePipelineRoutineUsecase,
    PipelineRepo,
  ],
  exports: [],
})
export class PipelineModule {}
