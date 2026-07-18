import { Module } from '@nestjs/common';
import CreateOperatorUsecase from './application/usecases/create-operator.usecase';
import FetchOperatorsUsecase from './application/usecases/fetch-operators.usecase';
import LoginUsecase from './application/usecases/login.usecase';
import UserRepo from './infrastructure/repos/user.repo';
import OperatorController from './presentation/http/controllers/operator.controller';
import UserController from './presentation/http/controllers/user.controller';

@Module({
  imports: [],
  controllers: [UserController, OperatorController],
  providers: [LoginUsecase, UserRepo, CreateOperatorUsecase, FetchOperatorsUsecase],
  exports: [UserRepo],
})
export class UserModule {}
