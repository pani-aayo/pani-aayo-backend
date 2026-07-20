import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import CreatePipelineUsecase from './application/usecases/create-pipeline.usecase';
import CreatePipelineRoutineUsecase from './application/usecases/create-pipeline-routine.usecase';
import FetchAssignedOperatorsUsecase from './application/usecases/fetch-assigned-operators.usecase';
import FetchAssignedPipelinesUsecase from './application/usecases/fetch-assigned-pipelines.usecase';
import FetchSubscribedPipelinesUsecase from './application/usecases/fetch-subscribed-pipelines.usecase';
import ListPipelinesUsecase from './application/usecases/list-pipelines.usecase';
import SetPipelineOperatorsUsecase from './application/usecases/set-pipeline-operators.usecase';
import SetPipelineStatusUsecase from './application/usecases/set-pipeline-status.usecase';
import SubscribePipelineUsecase from './application/usecases/subscribe-pipeline.usecase';
import UnsubscribePipelineUsecase from './application/usecases/unsubscribe-pipeline.usecase';
import PipelineRepo from './infrastructure/repos/pipeline.repo';
import PipelineController from './presentation/http/controllers/pipeline.controller';

@Module({
  imports: [UserModule],
  controllers: [PipelineController],
  providers: [
    CreatePipelineUsecase,
    ListPipelinesUsecase,
    FetchAssignedPipelinesUsecase,
    SetPipelineOperatorsUsecase,
    CreatePipelineRoutineUsecase,
    FetchAssignedOperatorsUsecase,
    SetPipelineStatusUsecase,
    SubscribePipelineUsecase,
    UnsubscribePipelineUsecase,
    FetchSubscribedPipelinesUsecase,
    PipelineRepo,
  ],
  exports: [],
})
export class PipelineModule {}
