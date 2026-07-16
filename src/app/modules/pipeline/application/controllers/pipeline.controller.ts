import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserRole } from '../../../../../generated/prisma/enums';
import { AuthUser } from '../../../../../shared/auth/decorators/current-user.decorator';
import { Public } from '../../../../../shared/auth/decorators/public.decorator';
import { Roles } from '../../../../../shared/auth/decorators/roles.decorator';
import type { IAuth } from '../../../../../shared/auth/token.service';
import { CreatePipelineDto } from '../dtos/create-pipeline.dto';
import { ListPipelinesDto } from '../dtos/list-pipelines.dto';
import CreatePipelineUsecase from '../usecases/create-pipeline.usecase';
import FetchAssignedPipelinesUsecase from '../usecases/fetch-assigned-pipelines.usecase';
import ListPipelinesUsecase from '../usecases/list-pipelines.usecase';

@Controller('pipelines')
class PipelineController {
  constructor(
    private readonly createPipelineUsecase: CreatePipelineUsecase,
    private readonly listPipelinesUsecase: ListPipelinesUsecase,
    private readonly fetchAssignedPipelinesUsecase: FetchAssignedPipelinesUsecase,
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
}

export default PipelineController;
