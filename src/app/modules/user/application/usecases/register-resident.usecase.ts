import { Injectable } from '@nestjs/common';
import { withoutAttrs } from '../../../../../shared/utils/object';
import { UserRole } from '../../domain/interfaces/user';
import UserRepo from '../../infrastructure/repos/user.repo';
import { RegisterResidentDto } from '../../presentation/http/dtos/register-resident.dto';

@Injectable()
class RegisterResidentUsecase {
  constructor(private readonly userRepo: UserRepo) {}

  async execute(dto: RegisterResidentDto) {
    const user = await this.userRepo.create({ ...dto, roles: [UserRole.RESIDENT] });
    return withoutAttrs(user, ['password']);
  }
}

export default RegisterResidentUsecase;
