import { Injectable } from '@nestjs/common';
import { UserRole } from '../../domain/interfaces/user';
import UserRepo from '../../infrastructure/repos/user.repo';
import { CreateOperatorDto } from '../../presentation/http/dtos/create-operator.dto';

@Injectable()
class CreateOperatorUsecase {
  constructor(private readonly userRepo: UserRepo) {}

  async execute(dto: CreateOperatorDto) {
    return this.userRepo.create({ ...dto, roles: [UserRole.OPERATOR] });
  }
}

export default CreateOperatorUsecase;
