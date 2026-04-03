import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) throw new Error('No token');
      const payload = this.jwtService.verify(token);
      client.data.user = payload;
    } catch (e) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // optional logic
  }

  @SubscribeMessage('joinList')
  handleJoinList(@MessageBody() listId: string, @ConnectedSocket() client: Socket) {
    if (client.data.user) {
      client.join(`list-${listId}`);
    }
  }

  @SubscribeMessage('leaveList')
  handleLeaveList(@MessageBody() listId: string, @ConnectedSocket() client: Socket) {
    client.leave(`list-${listId}`);
  }

  broadcastItemCreated(listId: string, item: any) {
    this.server.to(`list-${listId}`).emit('itemCreated', item);
  }

  broadcastItemUpdated(listId: string, item: any) {
    this.server.to(`list-${listId}`).emit('itemUpdated', item);
  }

  broadcastItemDeleted(listId: string, itemId: string) {
    this.server.to(`list-${listId}`).emit('itemDeleted', itemId);
  }
}
