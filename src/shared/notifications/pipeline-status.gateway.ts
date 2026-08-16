import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PipelineStatus } from '../../generated/prisma/enums';
import { IAuth, TokenService } from '../auth/token.service';

interface AuthenticatedSocket extends Socket {
  data: { user: IAuth };
}

@WebSocketGateway({ namespace: 'pipelines', cors: { origin: '*' } })
export class PipelineStatusGateway implements OnGatewayConnection {
  private readonly logger = new Logger(PipelineStatusGateway.name);

  @WebSocketServer()
  private readonly server!: Server;

  constructor(private readonly tokenService: TokenService) {
    this.logger.log('PipelineStatusGateway constructor');
  }

  async handleConnection(socket: AuthenticatedSocket) {
    const token = this.extractToken(socket);

    // Pipeline status is public data (mirrors the @Public() GET /pipelines route), so
    // anonymous residents may connect and join rooms without a token.
    if (!token) {
      this.logger.log(`Anonymous socket connected: ${socket.id}`);
      return;
    }

    try {
      socket.data.user = await this.tokenService.verify(token);
      this.logger.log(`Connection established for user ${socket.data.user.sub}`);
    } catch {
      socket.emit('exception', { message: 'Invalid or expired token' });
      socket.disconnect(true);
    }
  }

  @SubscribeMessage('pipeline:join')
  handleJoin(@ConnectedSocket() socket: AuthenticatedSocket, @MessageBody() pipelineCode: string) {
    socket.join(this.room(pipelineCode));
  }

  @SubscribeMessage('pipeline:leave')
  handleLeave(@ConnectedSocket() socket: AuthenticatedSocket, @MessageBody() pipelineCode: string) {
    socket.leave(this.room(pipelineCode));
  }

  emitStatus(pipelineCode: string, status: PipelineStatus) {
    this.server.to(this.room(pipelineCode)).emit('pipeline:status', { pipelineCode, status });
  }

  private room(pipelineCode: string): string {
    return `pipeline:${pipelineCode}`;
  }

  private extractToken(socket: Socket): string | undefined {
    const authToken = socket.handshake.auth?.token as string | undefined;
    if (authToken) return authToken;

    const [type, headerToken] = (socket.handshake.headers.authorization as string | undefined)?.split(' ') ?? [];
    return type === 'Bearer' ? headerToken : undefined;
  }
}
