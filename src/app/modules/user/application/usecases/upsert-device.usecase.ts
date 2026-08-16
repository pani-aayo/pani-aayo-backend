import { Injectable } from '@nestjs/common';
import UserRepo from '../../infrastructure/repos/user.repo';
import { UpsertDeviceDto } from '../../presentation/http/dtos/upsert-device.dto';

@Injectable()
class UpsertDeviceUsecase {
  constructor(private readonly userRepo: UserRepo) {}

  async execute(userCode: string, dto: UpsertDeviceDto) {
    return this.userRepo.upsertDevice(userCode, dto.deviceId, dto.voipToken);
  }
}

export default UpsertDeviceUsecase;
