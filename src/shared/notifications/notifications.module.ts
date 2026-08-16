import { Global, Module } from '@nestjs/common';
import { PipelineStatusGateway } from './pipeline-status.gateway';
import { PushNotificationService } from './push-notification.service';

@Global()
@Module({
  providers: [PushNotificationService, PipelineStatusGateway],
  exports: [PushNotificationService, PipelineStatusGateway],
})
export class NotificationsModule {}
