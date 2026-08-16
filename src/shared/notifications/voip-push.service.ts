import * as http2 from 'node:http2';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import { Env } from '../config/env.schema';

export interface VoipAlertPayload {
  id: string;
  nameCaller: string;
  handle: string;
  extra?: Record<string, string>;
}

const INVALID_STATUS_CODES = new Set([400, 410]);
const TOKEN_TTL_SECONDS = 55 * 60;

// Sends the "ring" alert to iOS devices as an APNs VoIP push — this is
// the only way Apple lets an app wake/launch in the background or
// terminated state and show a CallKit-style screen that keeps ringing.
@Injectable()
export class VoipPushService implements OnModuleInit {
  private readonly logger = new Logger(VoipPushService.name);

  private teamId?: string;
  private keyId?: string;
  private authKeyPem?: string;
  private bundleId?: string;
  private host = '';

  private cachedToken?: string;
  private cachedTokenIssuedAt = 0;

  constructor(private readonly config: ConfigService<Env, true>) {}

  onModuleInit() {
    this.teamId = this.config.get('APNS_TEAM_ID', { infer: true });
    this.keyId = this.config.get('APNS_KEY_ID', { infer: true });
    this.authKeyPem = this.config.get('APNS_AUTH_KEY', { infer: true })?.replace(/\\n/g, '\n');
    this.bundleId = this.config.get('APNS_BUNDLE_ID', { infer: true });
    this.host =
      this.config.get('APNS_ENVIRONMENT', { infer: true }) === 'production'
        ? 'https://api.push.apple.com'
        : 'https://api.development.push.apple.com';

    if (!this.isConfigured) {
      this.logger.warn('APNs credentials not configured; VoIP ringing pushes are disabled.');
    }
  }

  get isConfigured() {
    return Boolean(this.teamId && this.keyId && this.authKeyPem && this.bundleId);
  }

  // Returns voipTokens that APNs reports as no longer valid, so callers can
  // clear them the same way invalid FCM tokens are cleared.
  async sendToVoipTokens(voipTokens: string[], alert: VoipAlertPayload): Promise<string[]> {
    if (!this.isConfigured || voipTokens.length === 0) return [];

    const invalidTokens: string[] = [];
    const client = http2.connect(this.host);
    client.on('error', (err) => this.logger.warn(`APNs connection error: ${err.message}`));

    try {
      await Promise.all(voipTokens.map((token) => this.sendOne(client, token, alert, invalidTokens)));
    } finally {
      client.close();
    }

    return invalidTokens;
  }

  private sendOne(client: http2.ClientHttp2Session, deviceToken: string, alert: VoipAlertPayload, invalidTokens: string[]): Promise<void> {
    return new Promise((resolve) => {
      const body = JSON.stringify({ aps: { alert: alert.nameCaller }, ...alert });

      const req = client.request({
        ':method': 'POST',
        ':path': `/3/device/${deviceToken}`,
        authorization: `bearer ${this.getAuthToken()}`,
        'apns-topic': `${this.bundleId}.voip`,
        'apns-push-type': 'voip',
        'apns-priority': '10',
        'apns-expiration': '0',
      });

      let status = 0;
      let responseBody = '';
      req.on('response', (headers) => {
        status = Number(headers[':status'] ?? 0);
      });
      req.on('data', (chunk) => (responseBody += chunk));
      req.on('end', () => {
        if (status !== 200) {
          this.logger.warn(`VoIP push failed for token ${deviceToken}: ${status} ${responseBody}`);
          if (INVALID_STATUS_CODES.has(status)) invalidTokens.push(deviceToken);
        }
        resolve();
      });
      req.on('error', (err) => {
        this.logger.warn(`VoIP push request error for token ${deviceToken}: ${err.message}`);
        resolve();
      });

      req.end(body);
    });
  }

  private getAuthToken(): string {
    const now = Math.floor(Date.now() / 1000);
    if (this.cachedToken && now - this.cachedTokenIssuedAt < TOKEN_TTL_SECONDS) {
      return this.cachedToken;
    }

    this.cachedToken = jwt.sign({ iss: this.teamId, iat: now }, this.authKeyPem ?? '', {
      algorithm: 'ES256',
      keyid: this.keyId,
    });
    this.cachedTokenIssuedAt = now;
    return this.cachedToken;
  }
}
