import { Injectable } from '@nestjs/common';
import UserRepo from '../../infrastructure/repos/user.repo';
import { LogoutDto } from '../../presentation/http/dtos/logout.dto';

@Injectable()
class LogoutUsecase {
  constructor(private readonly userRepo: UserRepo) {}

  async execute(userCode: string, dto: LogoutDto) {
    if (dto.deviceId) {
      await this.userRepo.removeDevice(userCode, dto.deviceId);
    }
  }
}

export default LogoutUsecase;
