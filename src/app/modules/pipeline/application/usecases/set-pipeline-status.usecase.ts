import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PipelineStatus } from '../../../../../generated/prisma/enums';
import { PipelineStatusGateway } from '../../../../../shared/notifications/pipeline-status.gateway';
import { PushNotificationService } from '../../../../../shared/notifications/push-notification.service';
import { VoipPushService } from '../../../../../shared/notifications/voip-push.service';
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
    private readonly voipPushService: VoipPushService,
    private readonly pipelineStatusGateway: PipelineStatusGateway,
  ) {}

  async execute(pipelineCode: string, dto: SetPipelineStatusDto, userCode: string) {
    const pipeline = await this.pipelineRepo.findByCode(pipelineCode);
    if (!pipeline) throw new NotFoundException('Pipeline not found');
    if (pipeline.status === dto.status) throw new BadRequestException(`Pipeline is already ${dto.status.toLowerCase()}`);

    const updated =
      dto.status === PipelineStatus.OPEN
        ? await this.pipelineRepo.open(pipelineCode, userCode)
        : await this.pipelineRepo.close(pipelineCode, userCode);

    this.pipelineStatusGateway.emitStatus(pipelineCode, dto.status);

    this.notifySubscribers(pipelineCode, dto.status).catch((err) =>
      this.logger.error(`Failed to send pipeline status push notification for ${pipelineCode}`, err),
    );

    return updated;
  }

  private async notifySubscribers(pipelineCode: string, status: PipelineStatus) {
    const devices = await this.pipelineRepo.getSubscribedDevices(pipelineCode);
    if (devices.length === 0) return;

    const isOpen = status === PipelineStatus.OPEN;
    const notification = isOpen ? { title: 'पानी आयो!', body: 'Water has arrived.' } : { title: 'Valve closed', body: 'Supply has ended.' };

    const result = await this.pushNotificationService.sendToDeviceIds(
      devices.map((device) => device.deviceId),
      notification,
      { type: 'pipeline_status', pipelineCode, ...(isOpen && { alertType: 'ring' }) },
    );

    await Promise.all(result.invalidDeviceIds.map((deviceId) => this.userRepo.removeDeviceByDeviceId(deviceId)));

    // On OPEN, also wake iOS via a VoIP push — a regular FCM notification
    // can't reliably re-launch a backgrounded/terminated iOS app to ring.
    if (isOpen) await this.ringVoipDevices(pipelineCode, devices, notification);
  }

  private async ringVoipDevices(
    pipelineCode: string,
    devices: { deviceId: string; voipToken: string | null }[],
    notification: { title: string; body: string },
  ) {
    const voipTokens = devices.map((device) => device.voipToken).filter((token) => token != null);
    if (voipTokens.length === 0) return;

    const invalidVoipTokens = await this.voipPushService.sendToVoipTokens(voipTokens, {
      id: crypto.randomUUID(),
      nameCaller: notification.title,
      handle: notification.body,
      extra: { pipelineCode },
    });

    await Promise.all(invalidVoipTokens.map((voipToken) => this.userRepo.clearVoipToken(voipToken)));
  }
}

export default SetPipelineStatusUsecase;
