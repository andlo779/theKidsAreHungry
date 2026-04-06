import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ShoppingItem } from '@prisma/client';
import { AuthUser } from '../types';
import { JwtPayload } from '../auth/jwt.strategy';

interface AuthenticatedSocket extends Socket {
  data: {
    user?: AuthUser;
  };
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('EventsGateway');

  @WebSocketServer()
  server!: Server;

  constructor(private jwtService: JwtService) {}

  handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth.token as string;
      if (!token) throw new Error('No token');
      const payload = this.jwtService.verify<JwtPayload>(token);
      client.data.user = {
        id: payload.sub,
        email: payload.email,
        family_id: payload.family_id,
        name: payload.name,
      };
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`client disconnected from socket: ${client.id}`);
  }

  @SubscribeMessage('joinList')
  async handleJoinList(
    @MessageBody() listId: string,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (client.data.user) {
      await client.join(`list-${listId}`);
    }
  }

  @SubscribeMessage('leaveList')
  async handleLeaveList(
    @MessageBody() listId: string,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    await client.leave(`list-${listId}`);
  }

  broadcastItemCreated(listId: string, item: ShoppingItem) {
    this.server.to(`list-${listId}`).emit('itemCreated', item);
  }

  broadcastItemUpdated(listId: string, item: ShoppingItem) {
    this.server.to(`list-${listId}`).emit('itemUpdated', item);
  }

  broadcastItemDeleted(listId: string, itemId: string) {
    this.server.to(`list-${listId}`).emit('itemDeleted', itemId);
  }
}
