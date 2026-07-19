import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App, cert, initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { Env } from '../config/env.schema';

export interface PushNotificationPayload {
  title: string;
  body: string;
}

export interface SendPushResult {
  successCount: number;
  failureCount: number;
  invalidDeviceIds: string[];
}

const INVALID_TOKEN_ERROR_CODES = new Set(['messaging/registration-token-not-registered', 'messaging/invalid-registration-token']);

@Injectable()
export class PushNotificationService implements OnModuleInit {
  private readonly logger = new Logger(PushNotificationService.name);
  private app: App | null = null;

  constructor(private readonly config: ConfigService<Env, true>) {}

  onModuleInit() {
    const projectId = this.config.get('FIREBASE_PROJECT_ID', { infer: true });
    const clientEmail = this.config.get('FIREBASE_CLIENT_EMAIL', { infer: true });
    const privateKey = this.config.get('FIREBASE_PRIVATE_KEY', { infer: true });

    if (!projectId || !clientEmail || !privateKey) {
      this.logger.warn('Firebase credentials not configured; push notifications are disabled.');
      return;
    }

    this.app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  }

  async sendToDeviceIds(
    deviceIds: string[],
    notification: PushNotificationPayload,
    data?: Record<string, string>,
  ): Promise<SendPushResult> {
    if (!this.app || deviceIds.length === 0) {
      return { successCount: 0, failureCount: 0, invalidDeviceIds: [] };
    }

    const response = await getMessaging(this.app).sendEachForMulticast({
      tokens: deviceIds,
      notification,
      data,
    });

    const invalidDeviceIds: string[] = [];
    response.responses.forEach((result, index) => {
      if (!result.success) {
        const code = result.error?.code;
        if (code && INVALID_TOKEN_ERROR_CODES.has(code)) {
          invalidDeviceIds.push(deviceIds[index]);
        }
        this.logger.warn(`Push failed for device ${deviceIds[index]}: ${code}`);
      }
    });

    return { successCount: response.successCount, failureCount: response.failureCount, invalidDeviceIds };
  }
}
