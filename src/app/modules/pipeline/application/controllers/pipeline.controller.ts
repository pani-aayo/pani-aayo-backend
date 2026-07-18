import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UserRole } from '../../../../../generated/prisma/enums';
import { AuthUser } from '../../../../../shared/auth/decorators/current-user.decorator';
import { Public } from '../../../../../shared/auth/decorators/public.decorator';
import { Roles } from '../../../../../shared/auth/decorators/roles.decorator';
import type { IAuth } from '../../../../../shared/auth/token.service';
import { CreatePipelineDto } from '../dtos/create-pipeline.dto';
import { CreatePipelineRoutineDto } from '../dtos/create-pipeline-routine.dto';
import { ListPipelinesDto } from '../dtos/list-pipelines.dto';
import { SetPipelineOperatorsDto } from '../dtos/set-pipeline-operators.dto';
import CreatePipelineUsecase from '../usecases/create-pipeline.usecase';
import CreatePipelineRoutineUsecase from '../usecases/create-pipeline-routine.usecase';
import FetchAssignedPipelinesUsecase from '../usecases/fetch-assigned-pipelines.usecase';
import ListPipelinesUsecase from '../usecases/list-pipelines.usecase';
import SetPipelineOperatorsUsecase from '../usecases/set-pipeline-operators.usecase';

@Controller('pipelines')
class PipelineController {
  constructor(
    private readonly createPipelineUsecase: CreatePipelineUsecase,
    private readonly listPipelinesUsecase: ListPipelinesUsecase,
    private readonly fetchAssignedPipelinesUsecase: FetchAssignedPipelinesUsecase,
    private readonly setPipelineOperatorsUsecase: SetPipelineOperatorsUsecase,
    private readonly createPipelineRoutineUsecase: CreatePipelineRoutineUsecase,
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
}

export default PipelineController;
