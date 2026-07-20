import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PipelineStatus } from '../../../../../generated/prisma/enums';
import { PushNotificationService } from '../../../../../shared/notifications/push-notification.service';
import UserRepo from '../../../user/infrastructure/repos/user.repo';
import PipelineRepo from '../../infrastructure/repos/pipeline.repo';
import { SetPipelineStatusDto } from '../../presentation/http/dtos/set-pipeline-status.dto';

@Injectable()
class SetPipelineStatusUsecase {
  private readonly logger = new Logger(SetPipelineStatusUsecase.name);

  constructor(
    private readonly pipelineRepo: PipelineRepo,
    private readonly userRepo: UserRepo,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  async execute(pipelineCode: string, dto: SetPipelineStatusDto, userCode: string) {
    const pipeline = await this.pipelineRepo.findByCode(pipelineCode);
    if (!pipeline) throw new NotFoundException('Pipeline not found');
    if (pipeline.status === dto.status) throw new BadRequestException(`Pipeline is already ${dto.status.toLowerCase()}`);

    const updated =
      dto.status === PipelineStatus.OPEN
        ? await this.pipelineRepo.open(pipelineCode, userCode)
        : await this.pipelineRepo.close(pipelineCode, userCode);

    this.notifySubscribers(pipelineCode, dto.status).catch((err) =>
      this.logger.error(`Failed to send pipeline status push notification for ${pipelineCode}`, err),
    );

    return updated;
  }

  private async notifySubscribers(pipelineCode: string, status: PipelineStatus) {
    const deviceIds = await this.pipelineRepo.getSubscribedDeviceIds(pipelineCode);
    if (deviceIds.length === 0) return;

    const notification =
      status === PipelineStatus.OPEN
        ? { title: 'पानी आयो!', body: 'Water has arrived.' }
        : { title: 'Valve closed', body: 'Supply has ended.' };

    const result = await this.pushNotificationService.sendToDeviceIds(deviceIds, notification, {
      type: 'pipeline_status',
      pipelineCode,
    });

    await Promise.all(result.invalidDeviceIds.map((deviceId) => this.userRepo.removeDeviceByDeviceId(deviceId)));
  }
}

export default SetPipelineStatusUsecase;
