import { Global, Module } from '@nestjs/common';
import { PipelineStatusGateway } from './pipeline-status.gateway';
import { PushNotificationService } from './push-notification.service';
import { VoipPushService } from './voip-push.service';

@Global()
@Module({
  providers: [PushNotificationService, PipelineStatusGateway, VoipPushService],
  exports: [PushNotificationService, PipelineStatusGateway, VoipPushService],
})
export class NotificationsModule {}
