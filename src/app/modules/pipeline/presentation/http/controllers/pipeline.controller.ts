import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { UserRole } from '../../../../../../generated/prisma/enums';
import { AuthUser } from '../../../../../../shared/auth/decorators/current-user.decorator';
import { Public } from '../../../../../../shared/auth/decorators/public.decorator';
import { Roles } from '../../../../../../shared/auth/decorators/roles.decorator';
import type { IAuth } from '../../../../../../shared/auth/token.service';
import CreatePipelineUsecase from '../../../application/usecases/create-pipeline.usecase';
import CreatePipelineRoutineUsecase from '../../../application/usecases/create-pipeline-routine.usecase';
import FetchAssignedOperatorsUsecase from '../../../application/usecases/fetch-assigned-operators.usecase';
import FetchAssignedPipelinesUsecase from '../../../application/usecases/fetch-assigned-pipelines.usecase';
import FetchSubscribedPipelinesUsecase from '../../../application/usecases/fetch-subscribed-pipelines.usecase';
import ListPipelinesUsecase from '../../../application/usecases/list-pipelines.usecase';
import SetPipelineOperatorsUsecase from '../../../application/usecases/set-pipeline-operators.usecase';
import SetPipelineStatusUsecase from '../../../application/usecases/set-pipeline-status.usecase';
import SubscribePipelineUsecase from '../../../application/usecases/subscribe-pipeline.usecase';
import UnsubscribePipelineUsecase from '../../../application/usecases/unsubscribe-pipeline.usecase';
import { CreatePipelineDto } from '../dtos/create-pipeline.dto';
import { CreatePipelineRoutineDto } from '../dtos/create-pipeline-routine.dto';
import { ListPipelinesDto } from '../dtos/list-pipelines.dto';
import { SetPipelineOperatorsDto } from '../dtos/set-pipeline-operators.dto';
import { SetPipelineStatusDto } from '../dtos/set-pipeline-status.dto';

@Controller('pipelines')
class PipelineController {
  constructor(
    private readonly createPipelineUsecase: CreatePipelineUsecase,
    private readonly listPipelinesUsecase: ListPipelinesUsecase,
    private readonly fetchAssignedPipelinesUsecase: FetchAssignedPipelinesUsecase,
    private readonly setPipelineOperatorsUsecase: SetPipelineOperatorsUsecase,
    private readonly createPipelineRoutineUsecase: CreatePipelineRoutineUsecase,
    private readonly fetchAssignedOperatorsUsecase: FetchAssignedOperatorsUsecase,
    private readonly setPipelineStatusUsecase: SetPipelineStatusUsecase,
    private readonly subscribePipelineUsecase: SubscribePipelineUsecase,
    private readonly unsubscribePipelineUsecase: UnsubscribePipelineUsecase,
    private readonly fetchSubscribedPipelinesUsecase: FetchSubscribedPipelinesUsecase,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreatePipelineDto, @AuthUser() user: IAuth) {
    return this.createPipelineUsecase.execute(dto, user.code);
  }

  @Public()
  @Get()
  async list(@Query() dto: ListPipelinesDto) {
    return this.listPipelinesUsecase.execute(dto);
  }

  @Get('assigned')
  @Roles(UserRole.OPERATOR)
  async fetchAssignedPipelines(@AuthUser() user: IAuth) {
    return this.fetchAssignedPipelinesUsecase.execute(user);
  }

  @Get('subscribed')
  async fetchSubscribedPipelines(@AuthUser() user: IAuth) {
    return this.fetchSubscribedPipelinesUsecase.execute(user);
  }

  @Get(':code/operators')
  async getAssignedOperators(@Param('code') code: string) {
    return this.fetchAssignedOperatorsUsecase.execute(code);
  }

  @Put(':code/operators')
  @Roles(UserRole.ADMIN)
  async setOperators(@Param('code') code: string, @Body() dto: SetPipelineOperatorsDto, @AuthUser() user: IAuth) {
    return this.setPipelineOperatorsUsecase.execute(code, dto, user.code);
  }

  @Post(':code/routines')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async createRoutine(@Param('code') code: string, @Body() dto: CreatePipelineRoutineDto, @AuthUser() user: IAuth) {
    return this.createPipelineRoutineUsecase.execute(code, dto, user.code);
  }

  @Put(':code/status')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async setStatus(@Param('code') code: string, @Body() dto: SetPipelineStatusDto, @AuthUser() user: IAuth) {
    return this.setPipelineStatusUsecase.execute(code, dto, user.code);
  }

  @Post(':code/subscribe')
  async subscribe(@Param('code') code: string, @AuthUser() user: IAuth) {
    return this.subscribePipelineUsecase.execute(code, user.code);
  }

  @Delete(':code/subscribe')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unsubscribe(@Param('code') code: string, @AuthUser() user: IAuth) {
    return this.unsubscribePipelineUsecase.execute(code, user.code);
  }
}

export default PipelineController;
