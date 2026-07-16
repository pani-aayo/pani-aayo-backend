import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Roles } from '../../../../../../shared/auth/decorators/roles.decorator';
import CreateOperatorUsecase from '../../../application/usecases/create-operator.usecase';
import FetchOperatorsUsecase from '../../../application/usecases/fetch-operators.usecase';
import { UserRole } from '../../../domain/interfaces/user';
import { CreateOperatorDto } from '../dtos/create-operator.dto';
import { FetchOperatorsDto } from '../dtos/fetch-operators.dto';

@Controller('operators')
class OperatorController {
  constructor(
    private readonly createOperatorUsecase: CreateOperatorUsecase,
    private readonly fetchOperatorsUsecase: FetchOperatorsUsecase,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN)
  findAll(@Query() query: FetchOperatorsDto) {
    return this.fetchOperatorsUsecase.execute(query);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createOperatorDto: CreateOperatorDto) {
    return this.createOperatorUsecase.execute(createOperatorDto);
  }
}

export default OperatorController;
